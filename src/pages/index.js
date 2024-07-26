import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, MenuItem, Container, Typography, Box } from '@mui/material';

const Index = () => {
  const { register, handleSubmit, _, formState: { errors } } = useForm();
  const [pokemonList, setPokemonList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData) {
      setFormData(storedData);
      fetchPokemon(storedData.favoritePokemon);
    }
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => {
        setPokemonList(response.data.results);
      });
  }, []);

  const onSubmit = data => {
    localStorage.setItem('formData', JSON.stringify(data));
    setFormData(data);
    fetchPokemon(data.favoritePokemon);
  };

  const fetchPokemon = async (name) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    setPokemonData(response.data);
  };

  return (
    <Container maxWidth="sm">
      {!formData ? (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            User Information
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register('name', { required: true })}
              error={errors.name ? true : false}
              helperText={errors.name ? 'Name is required' : ''}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register('email', { required: true })}
              error={errors.email ? true : false}
              helperText={errors.email ? 'Email is required' : ''}
            />
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </form>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Favorite Pokemon
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              select
              label="Favorite Pokemon"
              fullWidth
              margin="normal"
              {...register('favoritePokemon', { required: true })}
              error={errors.favoritePokemon ? true : false}
              helperText={errors.favoritePokemon ? 'Please select a pokemon' : ''}
            >
              {pokemonList.map(pokemon => (
                <MenuItem key={pokemon.name} value={pokemon.name}>
                  {pokemon.name}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      )}
      {pokemonData && (
        <Box mt={4} textAlign="center">
          <Typography variant="h5">{pokemonData.name}</Typography>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
        </Box>
      )}
    </Container>
  );
};

export default Index;
