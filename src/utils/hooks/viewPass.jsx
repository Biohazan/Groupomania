
 export default function viewPass(e) {
    let passTypeTarget = e.target.previousElementSibling
    if (passTypeTarget.type === 'password') {
      passTypeTarget.type = 'text' 
      e.target.style.color = 'red'
    } else {
      passTypeTarget.type = 'password'
      e.target.style.color = 'white'
    }
  }
