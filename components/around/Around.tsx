import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import Letter from '../letter/Letter';
import styles from './Around.module.css';

const SIZE = 10;
const HOW_MANY_WORDS = 5;

const defaultselectedAtom = Array(SIZE)
	.fill(false)
	.map(() => Array(SIZE).fill(false));
export const selectedAtom = atom(defaultselectedAtom);
export const lettersAtom = atom([] as string[][]);
export const wordsAtom = atom([] as string[]);
export const selectedWordsAtom = atom([] as string[]);
export const pointsAtom = atom([] as [number, number][]);

const possibleWords = [
	'JAVA',
	'PYTHON',
	'JAVASCRIPT',
	'PHP',
	'VBNET',
	'SQL',
	'SWIFT',
	'RUBY',
	'MATLAB',
	'APACHE',
	'OBJECTIVE',
	'RUST',
	'SAS',
	'SCRATCH',
	'DART',
	'LOGO',
	'DELPHI',
	'COBOL',
	'KOTLIN',
	'OPENEDGE',
	'JULIA',
	'ABAP',
	'SCALA',
	'SCHEME',
	'PROLOG',
	'ADA',
	'LISP',
	'APEX',
	'LUA',
	'FORTRAN',
	'HASKELL',
	'HACK',
	'VBSCRIPT',
	'VISUAL',
	'TYPESCRIPT',
	'AWK',
	'ACTIONSCRIPT',
	'TCL',
	'SMALLTALK',
	'ABC',
	'ALICE',
	'APL',
	'AUTOLISP',
	'BASH',
	'BOURNESHELL',
	'CLIPPER',
	'CLOJURE',
	'COFFEESCRIPT',
	'CRYSTAL',
	'ELIXIR',
	'ERLANG',
	'EUPHORIA',
	'FORTH',
	'GENIE',
	'ICON',
	'IDL',
	'INFORM',
	'KORNSHELL',
	'LABVIEW',
	'LADDERLOGIC',
	'LIVECODE',
	'MAPLE',
	'MERCURY',
	'NATURAL',
	'OPENCL',
	'POSTSCRIPT',
	'RACKET',
	'RED',
	'RING',
	'RPG',
	'SPARK',
	'STATA',
	'VALA',
	'VERILOG',
	'VHDL'
];

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const directions = [
	'down',
	'up',
	'left',
	'right',
	'up-left',
	'up-right',
	'down-left',
	'down-right'
] as const;

const moveDirection = (
	d: typeof directions[number],
	x: number,
	y: number,
	i: number
): [number, number] => {
	switch (d) {
		case 'down':
			return [x, y + i];

		case 'up':
			return [x, y - i];

		case 'left':
			return [x - i, y];

		case 'right':
			return [x + i, y];

		case 'up-left':
			return [x - i, y - i];

		case 'up-right':
			return [x + i, y - i];

		case 'down-left':
			return [x - i, y + i];

		case 'down-right':
			return [x + i, y + i];
	}
};

const random = (max: number, min = 0) =>
	Math.floor(Math.random() * (max - min) + min);

const genLetters = (): [string[][], string[]] => {
	const out = Array(SIZE)
		.fill(undefined)
		.map(() => Array(SIZE).fill(undefined));
	let wordsCounter = 0,
		wordsGen: string[] = [],
		n: string,
		x: number,
		y: number,
		d: typeof directions[number];

	gen_loop: while (wordsCounter < HOW_MANY_WORDS) {
		x = random(SIZE);
		y = random(SIZE);

		n = possibleWords[random(possibleWords.length)];
		d = directions[random(directions.length)];

		if (wordsGen.includes(n)) continue;

		for (let i = 0; i < n.length; i++) {
			const [w, z] = moveDirection(d, x, y, i);

			if (
				w < 0 ||
				w >= SIZE ||
				z < 0 ||
				z >= SIZE ||
				(!!out[w][z] && out[w][z] != n[i])
			)
				continue gen_loop;
		}

		for (let i = 0; i < n.length; i++) {
			const [w, z] = moveDirection(d, x, y, i);

			out[w][z] = n[i];
		}

		wordsCounter++;
		wordsGen.push(n);
	}

	for (let i = 0; i < SIZE; i++)
		for (let j = 0; j < SIZE; j++)
			if (!out[i][j]) out[i][j] = letters[random(letters.length)];

	return [out, wordsGen];
};

function Around() {
	const [selectedWords] = useAtom(selectedWordsAtom);
	const [letters, setLetters] = useAtom(lettersAtom);
	const [words, setWords] = useAtom(wordsAtom);
	const [selected, setselected] = useAtom(selectedAtom);

	useEffect(() => {
		const [l, w] = genLetters();
		setLetters(l);
		setWords(w);
		setselected(defaultselectedAtom);
	}, []);

	if (selectedWords.length === words.length) {
		return (
			<div className={styles.finish}>
				<span>SIIIIIIIIIIIM</span>
				<img src='https://media.tenor.com/UxJkNAvuriIAAAAC/cr7-cristiano-ronaldo.gif' />
				<img src='https://media1.giphy.com/media/dJezVlwfVulTykjRQj/giphy.gif?cid=6c09b9528d1b29c0753851faf7a5db9112a9f06ab324e671&rid=giphy.gif&ct=g' />
			</div>
		);
	}

	return (
		<div className={styles.around}>
			<div
				className={styles.table}
				style={{ width: 2 * SIZE + 'vw', height: 2 * SIZE + 'vw' }}
			>
				{!!letters &&
					letters.map((e, x) => (
						<div key={'tr' + x}>
							{e.map((f, y) => (
								<Letter key={'tr' + x + 'td' + y} {...{ x, y }}>
									{f}
								</Letter>
							))}
						</div>
					))}
			</div>
			<div className={styles.words}>
				{!!words &&
					words.map(e => (
						<span
							key={e}
							className={
								selectedWords.includes(e)
									? styles.completed
									: styles['not-completed']
							}
						>
							{e}
						</span>
					))}
			</div>
		</div>
	);
}

export default Around;
