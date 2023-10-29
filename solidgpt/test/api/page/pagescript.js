async function uploadFiles() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;
    const urlPrefix = document.getElementById('serverURL').value;

    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/upload/'), {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data.message);
    }
}

async function loadRepo() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;
    const urlPrefix = document.getElementById('serverURL').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/load/repo/'), {
        method: 'POST',
        body: JSON.stringify({
            graphId: "abcd" // should be a uuid here
        }),
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
    });
    const data = await response.json();
    console.log(data.message);
}

//async function uploadAllFiles() {
//    const folderInput = document.getElementById('folderInput');
//    const files = folderInput.files;
//    const urlPrefix = document.getElementById('serverURL').value;
//
//    const formData = new FormData();
//    for (let i = 0; i < files.length; i++) {
//        formData.append('files', files[i]);
//    }
//
//    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/uploadrepo/'), {
//        method: 'POST',
//        body: formData
//    });
//
//    const data = await response.json();
//    console.log(data.message);
//}

async function removeAllFiles() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;
    const urlPrefix = document.getElementById('serverURL').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/remove/files/'), {
        method: 'POST',
    });
    const data = await response.json();
    console.log(data.message);
}

async function onboardRepo() {
    const urlPrefix = document.getElementById('serverURL').value;
    const uploadId = document.getElementById('uploadId').value;
    const openaiKey = document.getElementById('openaiKey').value;

    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/onboardrepo'), {
        method: 'POST',
        body: JSON.stringify({
            openai_key: openaiKey,
            upload_id: uploadId
        }),
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
    });

    const data = await response.json();
    console.log(data);
}

async function runPrdGraph() {
    const urlPrefix = document.getElementById('serverURL').value;
    const onboardId = document.getElementById('onboardId').value;
    const openaiKey = document.getElementById('openaiKey').value;
    const graphId = document.getElementById('graphId').value;
    const requirementContent = document.getElementById('requirement').value;
    const editContent = document.getElementById('edit_content').value;
    const projectAdditionalInfo = document.getElementById('project_additional_info').value;

    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/prd'), {
        method: 'POST',
        body: JSON.stringify({
            openai_key: openaiKey,
            current_graph_id: graphId,
            onboarding_id: onboardId,
            requirement: requirementContent,
            edit_content: editContent,
            project_additional_info: projectAdditionalInfo
        }),
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
    });

    const data = await response.json();
    console.log(data);
}

async function runAutogen() {
    const urlPrefix = document.getElementById('serverURL').value;
    const onboardId = document.getElementById('onboardId').value;
    const openaiKey = document.getElementById('openaiKey').value;
    const graphId = document.getElementById('graphId').value;
    const requirementContent = document.getElementById('requirement').value;
    const taskId = document.getElementById('taskId').value;
    const newSession = document.getElementById('newSession').value;

    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/autogenanalysis'), {
        method: 'POST',
        body: JSON.stringify({
            openai_key: openaiKey,
            onboarding_id: onboardId,
            requirement: requirementContent,
            task_id: taskId,
            is_new_session: newSession,
        }),
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
    });

    const data = await response.json();
    console.log(data);
}


async function runTechSolutionGraph() {
    const urlPrefix = document.getElementById('serverURL').value;
    const onboardId = document.getElementById('onboardId').value;
    const openaiKey = document.getElementById('openaiKey').value;
    const requirementContent = document.getElementById('requirement').value;

    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/techsolution'), {
        method: 'POST',
        body: JSON.stringify({
            openai_key: openaiKey,
            onboarding_id: onboardId,
            requirement: requirementContent,
        }),
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
    });

    const data = await response.json();
    console.log(data);
}

async function getGraphStatus() {
    const urlPrefix = document.getElementById('serverURL').value;
    const graphId = document.getElementById('graphId').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/status/graph'), {
            method: 'Post',
            body: JSON.stringify({
                graph_id: graphId
            }),
            headers: {
                'Content-Type': 'application/json', // Set the appropriate content type
            },
        });
    const data = await response.json();
    console.log(data);
}

async function getUploadStatus() {
    const urlPrefix = document.getElementById('serverURL').value;
    const uploadId = document.getElementById('uploadId').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/status/upload'), {
            method: 'Post',
            body: JSON.stringify({
                upload_id: uploadId // should be a uuid here
            }),
            headers: {
                'Content-Type': 'application/json', // Set the appropriate content type
            },
        });
    const data = await response.json();
    console.log(data);
}

async function getAutogenStatus() {
    const urlPrefix = document.getElementById('serverURL').value;
    const taskId = document.getElementById('taskId').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/status/autogen'), {
            method: 'Post',
            body: JSON.stringify({
                task_id: taskId // should be a uuid here
            }),
            headers: {
                'Content-Type': 'application/json', // Set the appropriate content type
            },
        });
    const data = await response.json();
    console.log(data);
}

async function testGet() {
    const urlPrefix = document.getElementById('serverURL').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/test/getmsg/'), {
            method: 'Get',
        });
    const data = await response.json();
    console.log(data.message);
}

async function testPost() {
    const urlPrefix = document.getElementById('serverURL').value;
    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/test/postmsg/'), {
            method: 'POST',
            body: JSON.stringify({
                msg: "abcd"
            }),
            headers: {
                'Content-Type': 'application/json', // Set the appropriate content type
            },
        });
    const data = await response.json();
    console.log(data.message);
}

function joinAndNormalizeUrl(base, ...parts) {
  return [base, ...parts]
    .map(part => part.trim().replace(/(^\/+|\/+$)/g, ''))
    .filter(part => part.length > 0)
    .join('/');
}


async function uploadAllFiles() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;
    const urlPrefix = document.getElementById('serverURL').value;

    const fileContents = [];
    const filenames = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Read the file content using FileReader
        const fileContent = await readFileContent(file);

        // Append the file content and filename to arrays
        fileContents.push(fileContent);
        filenames.push(file.name);
    }
    console.log(filenames)
    console.log(fileContents)

    const response = await fetch(joinAndNormalizeUrl(urlPrefix, '/uploadrepo/'), {
        method: 'POST',
        body: JSON.stringify({
            file_contents: fileContents,
            file_names: filenames
        }),
        headers: {
            'Content-Type': 'application/json', // Set the appropriate content type
        },
    });

    const data = await response.json();
    console.log(data.message);
    console.log("upload_id: " + data.upload_id)
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            resolve(fileContent);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file); // Read the file content as a data URL
    });
}
