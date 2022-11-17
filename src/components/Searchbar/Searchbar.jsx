import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Header,
  SearchForm,
  Button,
  ButtonLabel,
  Input,
} from './Searchbar.styled';

export function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(query);
    console.log(query);
  };

  const handleChange = e => {
    setQuery(e.target.value.trim());
  };

  return (
    <Header>
      <SearchForm onSubmit={handleSubmit}>
        <Button type="submit">
          <ButtonLabel>Search</ButtonLabel>
        </Button>

        <Input
          name="query"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
        />
      </SearchForm>
    </Header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
