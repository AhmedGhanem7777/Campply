// src/Service/api/locations.ts
import { api } from "../api/client";

export type Country = { id: number; name: string };
export type State = { id: number; name: string; country?: string; countryId?: number };
export type City = { id: number; name: string; state?: string; stateId?: number };

export const getCountries = () => api.get<Country[]>("/api/Location/countries");
export const getStates = () => api.get<State[]>("/api/Location/states");
export const getCities = () => api.get<City[]>("/api/Location/cities");

export const createCountry = (name: string) => api.post("/api/Location/countries", { name });
export const updateCountry = (id: number, name: string) => api.put(`/api/Location/countries/${id}`, { name });
export const deleteCountry = (id: number) => api.delete(`/api/Location/countries/${id}`);

export const createState = (name: string, countryId: number) =>
  api.post("/api/Location/states", null, { params: { Name: name, countryId } });

export const updateState = (id: number, name: string) =>
  api.put(`/api/Location/states/${id}`, { name });

export const deleteState = (id: number) => api.delete(`/api/Location/states/${id}`);

export const createCity = (name: string, stateId: number) =>
  api.post("/api/Location/cities", null, { params: { Name: name, stateId } });

export const updateCity = (id: number, name: string) =>
  api.put(`/api/Location/cities/${id}`, { name });

export const deleteCity = (id: number) => api.delete(`/api/Location/cities/${id}`);
