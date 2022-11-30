let counter = 0;

hello: while (counter++ < 12) {
	for (let i = 0; i < 10; i++) {
		if (i >= counter) continue hello;
		console.log(counter, i);
	}
	console.log('wow');
}
