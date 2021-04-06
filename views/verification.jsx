import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class VerificationPage extends React.Component {
  render() {
    return (
        <ApplicationLayout data={this.props}>
            <div className="text-center">
                <h1 className="page-title text-center mt-3">Two-Factor Authentication</h1>
                <hr />
                <div id="2fa-verification-area">

                </div>
            </div>
        </ApplicationLayout>
    );
  }
}

module.exports = VerificationPage;
