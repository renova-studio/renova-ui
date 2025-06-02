const main = async () => {
	const imagemin = (await import('imagemin')).default;
	const imageminPngquant = (await import('imagemin-pngquant')).default;

	const compressProjectPngs = async () => {
		try {
			const files = await imagemin(['src/assets/projects/uncompressed/*.png'], {
				destination: 'src/assets/projects',
				plugins: [
					imageminPngquant({
						strip: true, // Remove optional metadata
						speed: 1 // Maximum compression (1 = slowest but best)
					})
				]
			});

			console.log(`Successfully compressed ${files.length} images`);
			files.forEach(file => {
				console.log(`✓ ${file.destinationPath}`);
			});
		} catch (error) {
			console.error('Error compressing images:', error.message);
			process.exit(1);
		}
	};

    const imageminMozjpeg = (await import('imagemin-mozjpeg')).default;

	const compressProjectJpegs = async () => {
		try {
			const files = await imagemin(['src/assets/projects/uncompressed/*.{jpg,jpeg}'], {
				destination: 'src/assets/projects',
				plugins: [
					imageminMozjpeg({
						quality: 75, // Adjust quality (0-100)
						progressive: true // Create progressive JPEG
					})
				]
			});

			console.log(`Successfully compressed ${files.length} JPEG images`);
			files.forEach(file => {
				console.log(`✓ ${file.destinationPath}`);
			});
		} catch (error) {
			console.error('Error compressing JPEG images:', error.message);
			process.exit(1);
		}
	};

	await compressProjectPngs();
	await compressProjectJpegs();
};

	

main().catch(console.error);