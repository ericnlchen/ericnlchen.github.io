export function mainP() {
    const canvas = document.getElementById("background-canvas");
    const psHandle = document.getElementsByClassName("ps-handle")[0];
    psHandle.addEventListener("mousedown", () => {
        console.log('ps')
    })
}