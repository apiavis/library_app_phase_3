import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Jumbotron from './Jumbotron';
import Navbar from './Navbar';
import Footer from './Footer';
import DataTable from './DataTable';
import ModalController from './modals/ModalController';

import { getAllBooks,getBooksThisPage,previousPage,nextPage } from '../redux/actions/libraryActions';

import '../css/bootstrap.min.css';
import '../css/layout.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null
    };
  }

  handleModalToggle = (modalToOpen) => {
    this.setState({
      modal: modalToOpen
    });
  };

  populateEditModalInputs = (id) => {
    const bookToEdit = this.props.bookShelf.find((book) => book.id === id);
    bookToEdit.id = id;
    this.setState({
      bookToEdit
    });
  };

  previousPage = () => {
    if (this.props.pageNum > 1) {
      this.props.previousPage(); 
    } else {
      alert('This is the first page');
    }
  };

  nextPage = () => {
    const lastPage = Math.ceil(this.props.bookShelf.length / 5);
    if (this.props.pageNum < lastPage) {
      this.props.nextPage();
    } else alert('You are on the last page', this.state.pageNum, lastPage);
  };

  updateDisplayedBooks = (bookArr) => {
    if (bookArr) {
      this.setState({
        booksToDisplay: bookArr
      });
    }
  };

  componentDidMount= async() => {
    await this.props.getAllBooks();
    this.props.getBooksThisPage();
  }

  render() {

    return (
      <div>
        <Header handleModalToggle={this.handleModalToggle} />

        <Jumbotron />

        <Navbar
          handleModalToggle={this.handleModalToggle}
          updateDisplayedBooks={this.updateDisplayedBooks}
        />

        <ModalController
          modal={this.state.modal}
          handleModalToggle={this.handleModalToggle}
          bookShelf={this.props.bookShelf}
          bookToEdit={this.state.bookToEdit}
        />

        <DataTable
          booksToDisplay={this.props.booksToDisplay}
          handleModalToggle={this.handleModalToggle}
          populateEditModalInputs={this.populateEditModalInputs}
          nextPage={this.nextPage}
          previousPage={this.previousPage}
        />

        <Footer />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getAllBooks,
    getBooksThisPage,
    previousPage,
    nextPage
  };
}

function mapStateToProps(state) {
  return {
    bookShelf: state.library.bookShelf,
    booksToDisplay: state.library.booksToDisplay,
    pageNum: state.library.pageNum
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);