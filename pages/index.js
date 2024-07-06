import React, { Component } from 'react';
import Calendar from '../components/Calendar';
import Quiz from "../components/Quiz";

export default function Home() {
  return (
    <div>
      <h1>Learning Management System</h1>
      <Calendar />
      <Quiz />
    </div>
  );
}