# vscodepluginsolidgpt README

To start insert: npm run dev
Then: F5 launch extension
Then: CTRL + Shift + P + "Hello World"


## Build & install extension:
Windows:
1. Build server

Under Solidgpt-Private folder, run: 
```sh
pyinstaller --paths ".venv/" --collect-data=langchain --onefile --clean --name "run_api" run_api.py
```


You can find run_api.exe under dist folder

2. Copy run_api.exe to server folder

3. Build Vscode Extension

npm run build

npm run compile

4. Build Vscode package

vsce package

You can find vscodepluginsolidgpt-0.0.1.vsix

5. Install Vscode package

code --install-extension C:\proj\SolidGPT-Private\solidportal\vscodepluginsolidgpt\vscodepluginsolidgpt-0.0.1.vsix

6. Test package

Type ">", then select "SolidGPT: Run Extension"

### Mac Install
Follow below command lines
```sh
pyinstaller --paths ".venv/" --collect-data=langchain --onefile --clean --name "run_api" run_api.py --hidden-import=tiktoken_ext.openai_public --hidden-import=tiktoken_ext
mv dist/run_api solidportal/server & cd solidportal
sudo npm i && npm run build && npm run compile && vsce package
code --install-extension vscodepluginsolidgpt-<version number>.vsix
```
> version number please go check the package.json version property or check you vsix file's name.