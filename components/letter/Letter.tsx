import {
	lettersAtom,
	pointsAtom,
	selectedAtom,
	selectedWordsAtom,
	wordsAtom
} from '../around/Around';

import styles from './Letter.module.css';
import { useAtom } from 'jotai';

type LetterProps = { x: number; y: number; children: string };

const getDirection = (a: [number, number], b: [number, number]) => {
	const difference = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

	if (a[0] === b[0]) {
		if (a[1] > b[1]) return ['up', difference + 1];
		if (a[1] < b[1]) return ['down', difference + 1];
	}
	if (a[1] === b[1]) {
		if (a[0] > b[0]) return ['left', difference + 1];
		if (a[0] < b[0]) return ['right', difference + 1];
	}

	if (Math.abs(a[0] - b[0]) !== Math.abs(a[1] - b[1])) return 'none';

	if (a[0] > b[0]) {
		if (a[1] > b[1]) return ['up-left', difference / 2 + 1];
		if (a[1] < b[1]) return ['down-left', difference / 2 + 1];
	}
	if (a[0] < b[0]) {
		if (a[1] > b[1]) return ['up-right', difference / 2 + 1];
		if (a[1] < b[1]) return ['down-right', difference / 2 + 1];
	}
	return 'none';
};

function Letter({ x, y, children }: LetterProps) {
	const [letters] = useAtom(lettersAtom);
	const [words] = useAtom(wordsAtom);
	const [points, setPoints] = useAtom(pointsAtom);
	const [selected, setSelected] = useAtom(selectedAtom);
	const [selectedWords, setSelectedWords] = useAtom(selectedWordsAtom);

	let boxStyles = styles.box;

	if (points.filter(([w, z]) => w === x && z === y).length > 0)
		boxStyles += ` ${styles.selected}`;
	if (selected[x][y]) boxStyles += ` ${styles.green}`;

	const onClick = () => {
		if (points.length === 0) setPoints([[x, y]]);
		else {
			const first = points[0];
			const second: [number, number] = [x, y];
			const [direction, difference] = getDirection(first, second);
			let word = '',
				reverseWord = '';

			for (let i = 0; i < difference; i++) {
				if (direction === 'up') word += letters[first[0]][first[1] - i];
				if (direction === 'down') word += letters[first[0]][first[1] + i];
				if (direction === 'left') word += letters[first[0] - i][first[1]];
				if (direction === 'right') word += letters[first[0] + i][first[1]];
				if (direction === 'up-left')
					word += letters[first[0] - i][first[1] - i];
				if (direction === 'down-left')
					word += letters[first[0] - i][first[1] + i];
				if (direction === 'up-right')
					word += letters[first[0] + i][first[1] - i];
				if (direction === 'down-right')
					word += letters[first[0] + i][first[1] + i];
			}

			reverseWord = word.split('').reverse().join();

			for (let w of words) {
				if (w === word || w === reverseWord) {
					setSelectedWords([...selectedWords, word]);

					const newSelected = [...selected];

					for (let i = 0; i < difference; i++) {
						if (direction === 'up') newSelected[first[0]][first[1] - i] = true;
						if (direction === 'down')
							newSelected[first[0]][first[1] + i] = true;
						if (direction === 'left')
							newSelected[first[0] - i][first[1]] = true;
						if (direction === 'right')
							newSelected[first[0] + i][first[1]] = true;
						if (direction === 'up-left')
							newSelected[first[0] - i][first[1] - i] = true;
						if (direction === 'down-left')
							newSelected[first[0] - i][first[1] + i] = true;
						if (direction === 'up-right')
							newSelected[first[0] + i][first[1] - i] = true;
						if (direction === 'down-right')
							newSelected[first[0] + i][first[1] + i] = true;
					}

					setSelected(newSelected);

					break;
				}
			}

			setPoints([]);
		}
	};

	return (
		<div className={boxStyles} {...{ onClick }}>
			{children}
		</div>
	);
}

export default Letter;
