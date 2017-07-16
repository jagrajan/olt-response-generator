$(document).ready(function() {
    $('.ui.form').form({
        fields: {
            email: {
                identifier: 'email',
                rules: [
                    {
                        type: 'email',
                        prompt: 'Please enter an email'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please enter a password'
                    },
                    {
                        type: 'minLength[8]',
                        prompt: 'Password must be at least 8 characters'
                    }
                ]
            },
            confirmPassword: {
                identifier: 'confirmPassword',
                rules: [
                    {
                        type: 'match[password]',
                        prompt: 'The passwords do not match'
                    }
                ]
            }
        }
    });
});