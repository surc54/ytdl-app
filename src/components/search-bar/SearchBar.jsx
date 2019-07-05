import { Snackbar, TextField } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { reduxForm, submit } from "redux-form";
import { search } from "../../actions";
import FullSearchBar from "./FullSearchBar";
import InlineSearchBar from "./InlineSearchBar";
import "./SearchBar.scss";

const { clipboard } = window.require("electron");

class SearchBar extends React.Component {
    state = {
        snackbars: {
            clipboard: {
                open: false,
                message: "",
            },
        },
    };

    pasteFromClipboard = () => {
        const clipboardContent = clipboard.readText();
        if (clipboardContent) {
            this.props.change("search", clipboardContent.trim());
            this.setState({
                snackbars: {
                    ...this.state.snackbars,
                    clipboard: {
                        message: "Clipboard content was pasted.",
                        open: true,
                    },
                },
            });
        } else {
            this.setState({
                snackbars: {
                    ...this.state.snackbars,
                    clipboard: {
                        message:
                            "Clipboard was either empty or contained incompatible content.",
                        open: true,
                    },
                },
            });
        }
    };

    renderTextField = formProps => {
        return (
            <TextField
                label="Enter YouTube Link"
                fullWidth
                variant="outlined"
                {...formProps.input}
            />
        );
    };

    renderSnackbar() {
        return (
            <Snackbar
                open={!!this.state.snackbars.clipboard.open}
                onClose={() =>
                    this.setState({
                        snackbars: {
                            clipboard: {
                                ...this.state.snackbars.clipboard,
                                open: false,
                            },
                        },
                    })
                }
                autoHideDuration={3000}
                message={this.state.snackbars.clipboard.message}
            />
        );
    }

    onSubmit = values => {
        console.log("Submit detected: ", values);
        this.props.search(values.search);
    };

    render() {
        return (
            <div style={this.props.style}>
                <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    {(() => {
                        if (this.props.inline) {
                            return (
                                <InlineSearchBar
                                    onSearch={() => {
                                        console.log("ATTEMPTING SUBMIT!");
                                        submit("search");
                                    }}
                                    pasteFromClipboard={this.pasteFromClipboard}
                                    submitDisabled={!this.props.searchQuery}
                                    textField={this.renderTextField}
                                />
                            );
                        } else {
                            return (
                                <FullSearchBar
                                    onSearch={() => {
                                        submit("search");
                                    }}
                                    pasteFromClipboard={this.pasteFromClipboard}
                                    textField={this.renderTextField}
                                    clearDisabled={!this.props.searchQuery}
                                    submitDisabled={!this.props.searchQuery}
                                    clearFields={() => {
                                        this.props.change("search", "");
                                    }}
                                />
                            );
                        }
                    })()}
                </form>
                {this.renderSnackbar()}
            </div>
        );
    }
}

const validate = values => {
    const errors = {};

    if (!values.search || values.search.trim() === "") {
        return {
            search: "Search cannot be empty",
        };
    }

    return errors;
};

const wrappedForm = reduxForm({
    form: "search",
    validate,
    destroyOnUnmount: false,
})(SearchBar);

const mapStateToProps = (state, ownProps) => {
    let searchQuery = null;
    try {
        searchQuery = state.form.search.values.search;
    } catch (e) {
        searchQuery = null;
    }

    return {
        searchQuery,
    };
};

export default connect(
    mapStateToProps,
    { search }
)(wrappedForm);
