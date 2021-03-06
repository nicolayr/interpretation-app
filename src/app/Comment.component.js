
import React from 'react';
import { IntlProvider, FormattedRelative } from 'react-intl';
import { Avatar } from 'material-ui';

import actions from './actions/Comment.action';

const Comment = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        created: React.PropTypes.string,
        user: React.PropTypes.string,
        currentUser: React.PropTypes.string,
        interpretationId: React.PropTypes.string,
        deleteCommentSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return {
            data: this.props.data,
            text: this.props.data.text,
            oldText: this.props.data.text,
        };
    },

    _deleteHandler() {
        actions.deleteComment(this.props.interpretationId, this.state.data.id)
			.subscribe(() => {
    this.props.deleteCommentSuccess(this.state.data.id);
		});
    },

    _showEditHandler() {
        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;

        $(`#${divEditText}`).show();
        $(`#${divShowText}`).hide();
    },

    _onChange(e) {
        this.setState({ text: e.target.value });
    },

    _editCommentText() {
        const text = this.state.text;
        actions.editComment(this.props.interpretationId, this.state.data.id, text)
			.subscribe(() => {
    this.setState({
        text,
        oldText: text,
    });

    const divEditText = `edit_${this.props.data.id}`;
    const divShowText = `show_${this.props.data.id}`;

    $(`#${divEditText}`).hide();
    $(`#${divShowText}`).show();
		});
    },

    _cancelCommentText() {
        this.setState({
            text: this.state.oldText,
        });

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;

        $(`#${divEditText}`).hide();
        $(`#${divShowText}`).show();
    },

    render() {        
        const created = this.state.data.created.substring(0, 10).split('-');
        const time = this.state.data.created.substring(11, 19).split(':');
        let date = new Date(created[0], eval(created[1]) - 1, created[2], time[0], time[1], time[2]);

        const userName = this.state.data.user.name.split(' ');
        let initChars = userName[0][0];
        if (userName.length > 1) {
            initChars += userName[userName.length - 1][0];
        }

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;

        return (
            <table>
                <tr>
                    <td className="valignTop"><Avatar color="black" size="32">{initChars}</Avatar></td>
                    <td>
                        <div className="interpretationComment">
                            <a className="bold userLink">{this.state.data.user.name} </a>
                            <span className="interpretationText" id={divShowText}>{this.state.text}</span>
                            <div className="hidden" id={divEditText}>
                                <textarea className="commentArea" value={this.state.text} onChange={this._onChange} />
                                <a onClick={this._editCommentText}>  OK </a> | <a onClick={this._cancelCommentText}>  Cancel</a>
                            </div>
                            <br />
                            <span className="tipText">
                                <IntlProvider>
                                    <FormattedRelative value={date} />
                                </IntlProvider>
                            </span>
                            <span className={this.props.currentUser.id === this.state.data.user.id || this.props.currentUser.superUser ? '' : 'hidden'} >
                                <a onClick={this._showEditHandler}>  Edit </a>|
                                <a onClick={this._deleteHandler}>  Delete </a>
                            </span>
                        </div>
                    </td>
                </tr>
            </table>
        );
    },
});

export default Comment;
