import React from "react";
import { nanoid } from 'nanoid';
import { getDatabase, child, ref, set, get } from "firebase/database";
// Is the URL entered a valid URL or not
import { isWebUri } from 'valid-url';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// Pop ups at the top
import Tooltip from "react-bootstrap/Tooltip";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Store the long url the user inputs
            longURL: '',
            // Store what the user wants their alias to be for URL
            preferedAlias: '',
            // Store the URL that we generate for the user
            generatedURL: '',
            // Show that it is loading if true
            loading: false,
            // Where in our form do we have errors
            errors: [],
            // Keep trock of the errors for the "error"
            errorMessage: {},

            toolTipMessage: 'Copy To Clip Board',

        }
    }

    // When the user clicks the submit button, call this
    onSubmit = async (event) => {
        // Prevents the page from reloading when the submit is clicked.
        event.preventDefault();
        this.setState({
            // Indicates that the user has clicked submit.
            loading: true,
            // Set to blank so we don't use an old URL
            generatedURL: ''
        })

        // Validate the input the user has submitted
        var isFormValid = await this.validateInput()
        // If form is not valid then it reutrns
        if (!isFormValid) {
            return;
        }

        // Generate alias if user doesn't input alias
        var generatedKey = nanoid(5);
        var generatedURL = "URLite.com/" + generatedKey

        // If user inputs an alias
        if (this.state.preferedAlias !== '') {
            generatedKey = this.state.preferedAlias
            generatedURL = "URLite.com/" + this.state.preferedAlias
        }

        // Refrence to the firebase database
        const db = getDatabase();
        // Set path using the refrence 'db' plus our generated key
        set(ref(db, '/' + generatedKey), {
            // Wrtie in all the data to the database
            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL

        }).then((result) => {
            // If everything passes set state of the generatedURL and loading
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        }).catch((e) => {
            // Handle error
        })
    }

    // Checks if feild has an error
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    // Save the content of the form as the user is typing
    handleChange = (e) => {
        const { id, value } = e.target
        this.setState(prevState => ({
            ...prevState,
            // Set longURL to what ever we are typing 
            [id]: value
        }))
    }

    validateInput = async () => {
        var errors = [];
        var errorMessages = this.state.errorMessage

        // validate the long URL
        if (this.state.longURL.length === 0) {
            // User still needs to enter a URL
            errors.push("longURL");
            errorMessages['longURL'] = 'Please enter your URL.';
        } else if (!isWebUri(this.state.longURL)) {
            // If it is not a real proper URL.
            errors.push("longURL");
            errorMessages['longURL'] = 'Please enter a valid URL';
        }

        //Prefered Alias
        if (this.state.preferedAlias !== '') {
            if (this.state.preferedAlias.length > this.state.longURL.length) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Alias is longer than inputed URL';
            } else if (this.state.preferedAlias.indexOf(' ') >= 0) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Spaces are not allowed'
            }

            // Does the Alias already exist.
            var keyExists = await this.checkKeyExists()

            if (keyExists.exists()) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'The Alias you have entered already exists. Please enter another Alias.'
            }
        }

        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        // We found errors
        if (errors.length > 0) {
            return false;
        }

        return true;
    }

    // Check if the key exists in the database, if it does than error.
    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
            return false
        });
    }

    // Copy the generated URL to the clipboard
    copyToChipBoard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'Copied!'
        })
    }

    // HTML
    render() {
        return (
            <div className="container" >
                <form autoComplete="off">
                    <h3>URLite</h3>

                    {/*Long URl feild*/}
                    <p style={{ color: "black" }}></p>
                    <div className="form-group">
                        <label>Enter Your Long URL</label>
                        <input
                            id="longURL"
                            onChange={this.handleChange}
                            value={this.state.longURL}
                            type="url"
                            required
                            className={
                                this.hasError("longURL") ? "form-control is-invalid" : "form-control"

                            }
                            placeholder="https://www..."
                        />
                    </div>
                    <div
                        className={
                            this.hasError("longURL") ? "text-danger" : "visually-hidden"
                        }
                    >
                        {this.state.errorMessage.longURL}
                    </div>

                    {/* Alias feild*/}
                    <div className="form-group">
                        <label htmlFor="basic-url">Your Short URL</label>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">URLite.com/</span>
                            </div>
                            <input
                                id="preferedAlias"
                                onChange={this.handleChange}
                                value={this.state.preferedAlias}
                                className={
                                    this.hasError("preferedAlias") ? "form-control is-invalid" : "form-control"
                                }
                                type="text" placeholder="eg. 456frt (Optional)"
                            />
                        </div>
                        <div className={
                            this.hasError("preferedAlias") ? "text-danger" : "visually-hidden"
                        }>
                            {this.state.errorMessage.suggestedAlias}
                        </div>
                    </div>

                    {/*Make the button*/}
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        {
                            this.state.loading ?
                                <div>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </div> :
                                <div>
                                    <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </div>
                        }
                    </button>

                    {this.state.generatedURL === '' ?
                        <div></div> :
                        <div className="generatedurl">
                            <span>Your generated URL is: </span>
                            <div className="input-group mb-3">
                                <input disabled type="text" value={this.state.generatedURL} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    {/* Helps with tool tip*/}
                                    <OverlayTrigger
                                        key={'top'}
                                        placement={'top'}
                                        overlay={
                                            <Tooltip id={'tooltip-top'}>
                                                {this.state.toolTipMessage}
                                            </Tooltip>
                                        }
                                    >
                                        <button onClick={() => this.copyToChipBoard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button">Copy</button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                    }
                </form >
            </div >

        );
    }
}

export default Form;
