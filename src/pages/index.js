import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, MenuItem, Container, Typography, Box } from '@mui/material';

const Index = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1500').then((response) => {
      setPokemonList(response.data.results);
    });

    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData?.favoritePokemon) {
      setFormData(storedData);
      fetchPokemon(storedData.favoritePokemon);
      setValue('favoritePokemon', storedData.favoritePokemon);
    }
  }, [setValue]);

  const onUserSubmit = (data) => {
    setFormData(data);
  };

  const onPokemonSubmit = (data) => {
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
          <form onSubmit={handleSubmit(onUserSubmit)}>
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
          <form onSubmit={handleSubmit(onPokemonSubmit)}>
            <Controller
              name="favoritePokemon"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  select
                  label="Favorite Pokemon"
                  fullWidth
                  margin="normal"
                  {...field}
                  error={errors.favoritePokemon ? true : false}
                  helperText={errors.favoritePokemon ? 'Please select a pokemon' : ''}
                >
                  {pokemonList.map((pokemon) => (
                    <MenuItem key={pokemon.name} value={pokemon.name}>
                      {pokemon.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              rules={{ required: true }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      )}
      {pokemonData && (
        <Box mt={4} textAlign="center">
          <Typography variant="h4">{pokemonData.name}</Typography>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
        </Box>
      )}
    </Container>
  );
};

export default Index;
