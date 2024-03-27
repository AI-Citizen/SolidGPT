import * as vscode from 'vscode';
import path from 'node:path';
import { ChildProcess, exec, spawn } from 'child_process';
import * as os from 'os';

let openedFilesList;

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension is now active!');

  let disposable = vscode.commands.registerCommand('vscodepluginsolidgpt.runext', () => {
    const isProduction = context.extensionMode === vscode.ExtensionMode.Production;
    if (isProduction) {
      runServer(context.extensionPath);
    }

    function getMostRecentOpenedFiles() {
      const openedFiles = vscode.window.visibleTextEditors.map(editor => editor.document.fileName);
      return openedFiles;
    }

    const openedFiles = getMostRecentOpenedFiles();
    console.log('Recent Opened files:', openedFiles);

    function getAllOpenedFiles() {
      const openedFiles = vscode.window.tabGroups.all.flatMap(({ tabs }) =>
        tabs.map(tab => {
          const tabUri = tab?.input as vscode.TextDocument;
          return tabUri?.uri?.fsPath;
        })
      ).filter(fileName => fileName !== undefined);

      return openedFiles;
    }

    openedFilesList = getAllOpenedFiles();
    console.log('All Opened files:', openedFilesList);

    const panel = vscode.window.createWebviewPanel(
      'React',
      'SolidGPT',
      vscode.ViewColumn.Beside,
      {
        retainContextWhenHidden: true, // 保证 Webview 所在页面进入后台时不被释放
        enableScripts: true, // 运行 JS 执行
      }
    );

    // Initially send data to webview
    const initialDataToSend = {
      action: 'fileOpen',
      fileNames: openedFilesList,
    };
    panel.webview.postMessage(initialDataToSend);

    vscode.workspace.onDidOpenTextDocument(document => {
      // File opened, send data to the webview
      openedFilesList = getAllOpenedFiles();
      const dataToSend = {
        action: 'fileOpen',
        fileNames: openedFilesList,
      };
      panel.webview.postMessage(dataToSend);
    });

    vscode.workspace.onDidCloseTextDocument(document => {
      // File closed, send data to the webview
      openedFilesList = getAllOpenedFiles();
      const dataToSend = {
        action: 'fileClose',
        fileNames: openedFilesList,
      };
      panel.webview.postMessage(dataToSend);
    });

    let srcUrl = '';
    if (isProduction) {
      const filePath = vscode.Uri.file(
        path.join(context.extensionPath, 'dist', 'static/js/main.js')
      );
      srcUrl = panel.webview.asWebviewUri(filePath).toString();
    } else {
      srcUrl = 'http://localhost:3000/static/js/main.js';
    }
    panel.webview.html = getWebviewContent(srcUrl);

    const updateWebview = () => {
      panel.webview.html = getWebviewContent(srcUrl);
    };
    updateWebview();
    const interval = setInterval(updateWebview, 1000);

    panel.onDidDispose(
      () => {
        clearInterval(interval);
      },
      null,
      context.subscriptions,
    );
  });

  context.subscriptions.push(disposable);
  const provider = new SolidGPTViewProvider(
    context.extensionUri,
    context.extensionMode === vscode.ExtensionMode.Production,
    context.extensionPath,
    context.subscriptions
    );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SolidGPTViewProvider.viewType,
      provider,
      {
        webviewOptions: {
            retainContextWhenHidden: true
        }
      }
      ));
}

class SolidGPTViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'SolidGPT.webView';

	private _view?: vscode.WebviewView;
  private _initialized: boolean = false;

	constructor(
		private readonly _extensionUri: vscode.Uri,
    private readonly _isProduction: boolean,
    private readonly _extensionPath: string,
    private readonly _subscriptions: any
	) {
    if (_isProduction) {
      runServer(_extensionPath);
    }
  }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
    if (!this._initialized) {
      this._initialized = true;
    }
    else{
      return;
    }

		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

    function getAllOpenedFiles() {
      const openedFiles = vscode.window.tabGroups.all.flatMap(({ tabs }) =>
        tabs.map(tab => {
          const tabUri = tab?.input as vscode.TextDocument;
          return tabUri?.uri?.fsPath;
        })
      ).filter(fileName => fileName !== undefined);

      return openedFiles;
    }

    openedFilesList = getAllOpenedFiles();
    console.log('All Opened files:', openedFilesList);

    vscode.workspace.onDidOpenTextDocument(document => {
      // File opened, send data to the webview
      openedFilesList = getAllOpenedFiles();
      const dataToSend = {
        action: 'fileOpen',
        fileNames: openedFilesList,
      };
      webviewView.webview.postMessage(dataToSend);
    });

    vscode.workspace.onDidCloseTextDocument(document => {
      // File closed, send data to the webview
      openedFilesList = getAllOpenedFiles();
      const dataToSend = {
        action: 'fileClose',
        fileNames: openedFilesList,
      };
      webviewView.webview.postMessage(dataToSend);
    });

    webviewView.webview.onDidReceiveMessage(message => {
      if (message.type === 'webviewReady') {
        // The webview is ready, push your message here
        openedFilesList = getAllOpenedFiles();
        vscode.window.showInformationMessage(openedFilesList.join(', '));
          const dataToSend = {
            action: 'fileOpen',
            fileNames: openedFilesList,
          };
          webviewView.webview.postMessage(dataToSend);
      }
    });

    // get html
    let srcUrl = '';
    if (this._isProduction) {
      const filePath = vscode.Uri.file(
        path.join(this._extensionPath, 'dist', 'static/js/main.js')
      );
      srcUrl = webviewView.webview.asWebviewUri(filePath).toString();
    } else {
      srcUrl = 'http://localhost:3000/static/js/main.js';
    }
    webviewView.webview.html = getWebviewContent(srcUrl);

    const updateWebview = () => {
      webviewView.webview.html = getWebviewContent(srcUrl);
    };
    updateWebview();
    const interval = setInterval(updateWebview, 1000);

    // Initially send data to webview
    const initialDataToSend = {
      action: 'fileOpen',
      fileNames: openedFilesList,
    };
    webviewView.webview.postMessage(initialDataToSend);

    webviewView.onDidDispose(
      () => {
        clearInterval(interval);
      },
      null,
      this._subscriptions,
    );
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function runServer(rootpath: any) {
  const terminal = vscode.window.createTerminal(`SolidGPT Extension Terminal`);
  const isWindows = os.platform() === 'win32';
  // Set the server executable based on the operating system
  const architecture = os.arch();
  const serverExecutable = isWindows ? '/server/run_api.exe' : architecture==='arm64' ? '/server/run_api' : '/server/run_api_x86';
  if (isWindows)
  {
    terminal.sendText(`& "${rootpath}${serverExecutable}"`);
  }
  else
  {
    const fullPath = path.join(path.normalize(rootpath), (serverExecutable));
    terminal.sendText(`${fullPath}`);
  }
}

function runServerBackground(rootpath: any) {
  const serverExecutable = 'run_api.exe';
  const cwd = `${rootpath}/server`;
  const options = {
    cwd: cwd,
  };

  const command = `${serverExecutable}`;

  exec(command, options, (error, stdout, stderr) => {
      if (error) {
          vscode.window.showErrorMessage(`Error server: ${error.message}`);
      } else {
          vscode.window.showInformationMessage(`server successfully: ${stdout}`);
      }
  });
}

export function deactivate() {

}

function getWebviewContent(srcUri: string) {
  const nonce = getNonce();
  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>webview-react</title>
    <script defer="defer" src="${srcUri}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`;
}
