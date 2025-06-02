const main = async () => {
	const imagemin = (await import('imagemin')).default;
	const imageminPngquant = (await import('imagemin-pngquant')).default;


	const compressMaterialPngs = async (category) => {
		try {
			const files = await imagemin([`src/assets/materials/${category}/uncompressed/*.png`], {
				destination: `src/assets/materials/${category}`,
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


	const materialCategories = ['marble', 'metal', 'stone', 'terrazzo', 'wood']
	for (const category of materialCategories) {
		await compressMaterialPngs(category);
	}
	
};

	

main().catch(console.error);