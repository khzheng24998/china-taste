const inputLimit = 512;

function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

/* Cookie accessor functions */

function setCookie(cname, cvalue, lifespan) 
{
    let date = new Date();
    date.setTime(date.getTime() + lifespan);
    let expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

function getCookie(cname) 
{
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) 
    {
        let c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
      	
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return "";
}

/* End of cookie accessor functions */

/* Input validation functions */

function validateRequiredInput(input)
{
	let errorMsg = "";

	if (input.length === 0)
		errorMsg = "Required field.";
	else if (input.length > inputLimit)
		errorMsg = "Input exceeds character limit.";
	else
		errorMsg = "ok";

	return errorMsg;
}

function validatePhoneNumber(phoneNumber)
{
	let errorMsg = "";

	if (phoneNumber.length === 0)
		errorMsg = "Required field.";
	else
	{
		let invalid = false;

		//Immediately return false if input is too long
		if (phoneNumber.length > 25)
			invalid = true;

		//Phone number contains letters
		let letters = phoneNumber.match(/[A-Za-z]/g);
		if (letters != null)
			invalid = true;

		//Remove common optional characters found in phone numbers
		let numbers = phoneNumber.replace(/[-() +]/g, "");

		//Phone number has no digits
		let arr = phoneNumber.match(/[0-9]/g);
		if (arr == null)
			invalid = true;

		//Phone number contains special characters
		let noSpecialChars = arr.toString();
		noSpecialChars = noSpecialChars.replace(/,/g, "");

		if (numbers != noSpecialChars)
			invalid = true;

		//Phone number is too long/short
		if (numbers.length != 10 && numbers.length != 11)	//with country call code
			invalid = true;

		if (invalid)
			errorMsg = "Invalid phone number.";
		else
			errorMsg = "ok";
	}

	return errorMsg;
}

function validatePassword(password)
{
	let letters = password.match(/[A-Za-z]/g);
	let numbers = password.match(/[0-9]/g);

	let errorMsg = validateRequiredInput(password);
	if (errorMsg === "ok" && (password.length < 8 || letters === null || numbers === null))
		errorMsg = "Password does not meet requirements.";

	return errorMsg;
}

function validateConfirmation(password, confirmation)
{
	let errorMsg = validateRequiredInput(confirmation);

	if (errorMsg === "ok" && password !== confirmation)
		errorMsg = "Does not match password";

	return errorMsg;
}