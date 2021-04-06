import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class PublicHomePageView extends React.Component {

  render() {
    return (
      <ApplicationLayout includeFooter={true} data={this.props}>
        <div className="container my-5 py-5 pt-sm-4 px-3">

          {/* Welcome */}
          <div className="row pt-4">

            <div className="col-7">
              <p className="primary-reg-56 font-secondary">Metis Messenger</p>
              <p className="primary-reg-18 font-secondary mt-4">
                A decentralized messaging platform on the blockchain. End-to-end encrypted messaging that is 100% private and decentralized.
              </p>

              <a
                className="btn btn-custom mt-4"
                href="/login"
              >
                Get Started
              </a>
            </div>

            <div className="d-none d-md-block col-5">
              <img src="/img/jupiter-blockchain.png" className="metis-hero-img" alt="jupiter blockchain" />
            </div>
          </div>

        </div>

      </ApplicationLayout>
    );
  }
}

module.exports = PublicHomePageView;
