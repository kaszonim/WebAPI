
String.prototype.palindrome = require('./palindrome')
String.prototype.capitalise = require('./capitalise')

const phrases = ['eve',
               'kayak',
               'mom',
               'wow',
               'noon',
               'Not a palindrome']

for (const phrase of phrases) {
	console.log (phrase.capitalise())	
	if (phrase.palindrome()) {
		console.log(`"${phrase}" is a palindrome`)
	} else {
		console.log(`"${phrase}" is NOT a palindrome`)
	}
}

/*
for (const phrase of phrases) {
	const answer = phrase.palindrome() ? '' : 'NOT '
	console.log(`"${phrase}" is ${answer}a palindrome`)
}
*/
