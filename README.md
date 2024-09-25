# PROJECT DEPRECATED (Will be rewriten some time in the future)

Project moved [here](https://github.com/Willi-js/Lighter-rust)

# Lighter


Lighter is my passion project. My work is currently focused on Digital Audio Workstation (DAW).
At its current stage, Lighter is far from being complete and usable. I have conceptualized its core idea, but the full implementation is still pending. Given that Lighter is a labor of love, I am committed to investing my utmost effort, refraining from hastiness to avoid creating a hastily executed project. For those familiar with the industry-standard 'Ableton Live,' a clear influence is evident in Lighter's user interface (UI), showcasing my admiration for this benchmark software.
# set up

Understanding the intricacies of the codebase might be a daunting task but if u have a death wish please be my guest.

### requirements: 
- node.js v20 <
- npm v10.2.4 <
- clang 
- emcc (Emscript: https://emscripten.org/docs/getting_started/downloads.html)

>That should be it for requirements if I haven't missed anything, if I have let me know.

### set up steps

1. clone the repository in your desired location
2. cd into the cloned repository
3. run `npm install` or `npm i`
4. run `cd ./csrc`
5. run `./compile`
6. go back to the root of the repository (`cd ../`)
7. run `npm run start`

That should get you going.

# How to use Lighter

When you have started the application a start up window will pop up, in here you will be able to choose to either start a new project by clicking `new project` or open an already created project by clicking `open project`. When creating a new project you will be asked to choose a directory for it, I recomend creating a new empty directory and create a new project there to not mess up anything. When opening an already made project you will be once again asked to choose project root directory, so choose the directory where you created your project. Error handling for this is not implemented yet so just... Choose the directory that you know has all the files and folders Lighter has created for you, if you will choose the incorrect directory nothing serious should happen but application will fail
(I will work on implementing proper project opening system in due time when motivation hits me :))

When you have a project open im sorry to tell you but there's not that much you can do yet. You can click around and see what you can find by reading through the code and looking at what does what, but other then that there's not much to do yet 'cause like I said in the beginning, this project is my passion project and im working on it when ever I have motivation, sometimes its everyday for hours, and sometimes there's a month gap between opening the files of it.
