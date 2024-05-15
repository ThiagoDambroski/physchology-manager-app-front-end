const apiRequestPostReturn = async (url = '', optionObj = null) => {
    try {
        const response = await fetch(url, optionObj);

        if (!response.ok) {
            let errorMessage = 'An error occurred';

            try {
                // Attempt to parse the response body as JSON
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (jsonError) {
                // If parsing as JSON fails, use the default error message
            }

            throw Error(errorMessage);
        }

        const responseData = await response.json();
        ;

        return responseData;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};

export default apiRequestPostReturn;