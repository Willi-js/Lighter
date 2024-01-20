# Lighter

Lighter is my pation project, a DAW (Digitas Audio Workstation) that I am currently working on, its by no means complete and not useable yet. I only have the general idea but haven't implemented it yet. If you have worked with one of the industry standarts Ableton Live you will clearly see that the UI is heavily inspired by it.

# set up

I don't know why anyone would want to even try to figure out how all of this code hell works, but if you have a death wish please be my guesst. 

### requirements: 
- node.js v20 <
- npm v10.2.4 <
- clang 
- emcc (Emscpten: https://emscripten.org/docs/getting_started/downloads.html)

>that should be it for requirements if I didn't miss anything, if I have let me know.

### set up steps

1. clone the repository in your desired location
2. cd into the cloned repository
3. run `npm install` or `npm i`
4. run `cd ./csrc`
5. run `./compile`
6. go back to the root of the repository (`cd ../`)
7. run `npm run start`

that should get you going.

# How to use Lighter

when you have started the application a start up window will pop up, in here you will be able to choose to either start a new project by clicking `new project` or open an already created project by clicking `open project`, when creating a new project you will be asked to choose a directory for it, I recoment creating a new empty directory and create a new project there to not mess up anything. When opening an already made porject you will be once again asked to choose project root direcotry, so choose the directory where you created your project, error handling for this is not implemented yet so just... Choose the directory that you know has all the files and folders Lighter created for you, if you will choose incorrect directory nothing seriouse should happen but application will fail (I will work on implementing proper project opening system when I have time aka when Im not lazy to do it XD.)

When you have a project open Im sorry to tell you there's not that much you can do yet, you can click around and see what you can find by reading trought the code and looking at what does what, but other then that there's not much to do yet 'cause like I said in the beginning this project is my pation project and Im working on it when ever I have motivation, sometimes its everyday for hours, and sometimes there's a month gap between even opening the files of it.