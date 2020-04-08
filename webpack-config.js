// Require path.
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// Configuration object.
const config = {
    // Create the entry points.
    // One for frontend and one for the admin area.
    entry: {
        // frontend and admin will replace the [name] portion of the output config below.
        frontend: './app.js',
        //admin: './src/admin/admin-index.js'
    },

    // Create the output files.
    // One for each of our entry points.
    output: {
        // [name] allows for the entry object keys to be used as file names.
        filename: 'js/[name].js',
        // Specify the path to the JS files.
        path: path.resolve(__dirname, 'assets')
    },
    resolve: {alias: {vue: 'vue/dist/vue.esm.js'}},

    // Setup a loader to transpile down the latest and great JavaScript so older browsers
    // can understand it.
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ]
}

// Export the config object.
module.exports = config;
