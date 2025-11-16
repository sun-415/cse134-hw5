document.addEventListener("DOMContentLoaded", function () {
    const nameInput    = document.getElementById("name");
    const emailInput   = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    
    // Allowed character regex for name
    const allowedChars = /^(?=.*[A-Za-z])[A-Za-z\s]*$/;
    
    function showError(input, message){
        const errorOutput = document.getElementById(input.id + "-error");
        errorOutput.textContent = message;
        errorOutput.classList.remove("hidden");
        input.classList.add("flash");

        console.log(`${input.classList}, ${errorOutput.classList}`);
    
        setTimeout(() => {
            console.log(`${input.classList}, ${errorOutput.classList}`);
            errorOutput.classList.add("hidden");
            input.classList.remove("flash");
        }, 2000);
    }
    
    // Masking input for Name and Comments
    function enforceCharacterRules(event){
        if(!allowedChars.test(event.target.value)){
            showError(event.target, "Invalid character entered.");
            event.target.value = event.target.value.replace(/[^A-Za-z\s]/g, "");
        }
    }

    // Using setCustomValidity() to only allow submission of gmail users
    function enforceGmail(){
        // Validate with the built-in constraints
        emailInput.setCustomValidity("");
        if (!emailInput.validity.valid) {
            return;
        }

        // Extend with a custom constraints
        if (!emailInput.value.endsWith("@gmail.com")) {
            emailInput.setCustomValidity("Please enter an email address of @gmail.com");
        }   
    }
    
    nameInput.addEventListener("input", enforceCharacterRules);
    nameInput.addEventListener("invalid", (e) => {
        showError(nameInput, "Please enter your name.")
    });

    emailInput.addEventListener("input", enforceGmail);

});

