import React from 'react';
import './RulesPage.css';

const RulesPage = () => {
    return (
        <div className="rules-container">
            <h1>Sudoku Rules</h1>
            <section className="rules-card">
                <ol className="rules-list">
                    <li>Fill the grid so every <strong>row</strong> contains the digits 1–9 without repeats.</li>
                    <li>Every <strong>column</strong> must also contain the digits 1–9 without repeats.</li>
                    <li>Each <strong>3×3 subgrid</strong> (or 2x3 in easy mode) must contain the digits without repeats.</li>
                    <li>Use the given numbers as fixed clues; only empty cells can be filled.</li>
                    <li>A puzzle is solved when all cells are filled correctly.</li>
                </ol>
            </section>
            <section className="credits-card">
                <h2>Credits</h2>
                <p className="made-by">This project was made by Alka Tripathi and Poorva Barve.</p>
                <ul className="links">
                    <li>Email: <a href="mailto:barve.p@northeastern.edu">barve.p@northeastern.edu</a></li>
                    <li>GitHub: <a href="https://github.khoury.northeastern.edu/Alka-and-Poorva/CS5610-Sudoku-Project1" target="_blank" rel="noopener noreferrer">Project Repository</a></li>
                </ul>
            </section>
        </div>
    );
};

export default RulesPage;