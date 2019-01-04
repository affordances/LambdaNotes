import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import NoteForm from './components/NoteForm';
import Note from './components/Note';
import NoteList from './components/NoteList';
import Sidebar from './components/Sidebar';
import NoMatch from './components/NoMatch';
import { getNotes, addNote } from './actions';

class App extends Component {
  state = {
    filteredNotes: [],
    searchPhrase: "",
    title: "",
    content: ""
  }

  // fetches all notes from server and passes them to store
  componentDidMount() {
    this.props.getNotes();
  }

  // adjusts state of title and content whenever there is new input
  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  // adjusts state of search phrase, then limits note collection to that phrase
  handleSearchChange = e => {
    this.setState({ searchPhrase: e.target.value });
    setTimeout(() => {
      const notes = this.props.notes.filter(note => {
        return (
          note.title.toLowerCase().includes(this.state.searchPhrase.toLowerCase()) ||
          note.content.toLowerCase().includes(this.state.searchPhrase.toLowerCase())
        )
      });
      this.setState({ filteredNotes: notes });
    }, 1);
  };

  // sends current state of title and content to server, resets state, redirects to home page
  handleFormSubmit = e => {
    e.preventDefault();
    const { title, content } = this.state;
    if (title === "" || content === "") { return; }
    this.props.addNote({ title, content });
    this.setState({ title: "", content: "" });
    this.props.history.push("/");
  }

  render() {
    const { searchPhrase, title, content, filteredNotes } = this.state;
    return (
      <div className="container">
        <Sidebar searchPhrase={searchPhrase}
          handleSearchChange={this.handleSearchChange} />

        <Switch>

          <Route exact path="/" render={ props =>
            <NoteList notes={filteredNotes.length > 0 ? filteredNotes : this.props.notes}
            />
          }
          />

          <Route path="/notes/add" render={ props =>
            <NoteForm type={"new"}
              title={title}
              content={content}
              handleFormSubmit={this.handleFormSubmit}
              handleInputChange={this.handleInputChange}
              />
            }
          />

          <Route path="/notes/:id" render={ props =>
              <Note {...props} />
            }
          />

          <Route render={ props =>
              <NoMatch missing={"route"}/>
            }
          />

        </Switch>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes
  }
}

export default withRouter(connect(mapStateToProps, { getNotes, addNote })(App));
