let errorMessages = {
    'cannot-move-own-car': 'Ne možete da pomerite svoj auto 😁'
}

export function getErrorMessage(error) {
    return errorMessages[error.message] || error.message
}