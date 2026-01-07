let darkmode=localStorage.getItem('darkmode')
let darkmodetoggle=document.querySelector('#dark')

const darkmodeenable=()=>{
    document.body.classList.add("darkmode")
    localStorage.setItem("darkmode", "enabled")
}
const darkmodeunenable = () => {
    document.body.classList.remove("darkmode")
 
    localStorage.setItem("darkmode", null)
}

if(darkmode=="enabled"){
    darkmodeenable()
}

darkmodetoggle.addEventListener('click',()=>{
    darkmode=localStorage.getItem('darkmode')
    if (darkmode !== "enabled") {
        darkmodeenable()
    } else {
        darkmodeunenable()
    }
})


// const dark=()=>{
//     // const bodyid=document.getElementById('body')
//     // const bodyid1=document.getElementById('bod1')
//     // bodyid.style.backgroundColor ="	#696969"
//     // bodyid1.style.backgroundColor ="	#696969"
//     // localStorage.setItem('--color', '#696969')
//     // document.documentElement.style.setProperty('--color', '#696969')
//     // document.body.classList.add("darkmode")
//     // localStorage.setItem("darkmode","enabled"

// }