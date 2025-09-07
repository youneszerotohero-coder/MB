exports.isEmail = (s) => /\S+@\S+\.\S+/.test(s);

exports.validateOrderData = (data, required = true) => {
	const errors = {};
	if (required) {
		if (!data.customerName) errors.customerName = 'Customer name is required';
		if (!data.customerPhone) errors.customerPhone = 'Customer phone is required';
		if (!data.items || !Array.isArray(data.items) || data.items.length === 0) errors.items = 'Order items are required';
	}
	return { isValid: Object.keys(errors).length === 0, errors };
};

exports.validateProductData = (data, required = true) => {
	const errors = {};
	if (required) {
		if (!data.name) errors.name = 'Product name is required';
		if (!data.price && data.price !== 0) errors.price = 'Product price is required';
	}
	return { isValid: Object.keys(errors).length === 0, errors };
};

exports.validateCategoryData = (data, required = true) => {
	const errors = {};
	if (required) {
		if (!data.name) errors.name = 'Category name is required';
		if (!data.slug) errors.slug = 'Category slug is required';
	}
	return { isValid: Object.keys(errors).length === 0, errors };
};
