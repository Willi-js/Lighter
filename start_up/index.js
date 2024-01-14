//const funct = async () => {
//    const response = await electron.test();
//    console.log(response);
//}
//
//funct()

const newProject = document.querySelector('#new');
const openProject = document.querySelector('#open');

newProject.addEventListener('click', async () => {
    await electron.newProject();
});

openProject.addEventListener('click', async () => {
    await electron.openProject();
})