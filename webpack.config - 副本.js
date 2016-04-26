var webpack = require('webpack')
var path = require('path');
var fs = require('fs');
var debug = false
var srcDir = path.resolve(process.cwd(), 'src');
var dist = 'src/';
var entries = genEntries();
module.exports = {

  	entry:entries,
  	output: {  //用于定义构建后的文件的输出。其中包含path和filename：
	    // path: __dirname,
	    // filename: 'src/bundle.js',
	    // publicPath: "http://localhost:3000/src/"

	
	
	    path: path.resolve(debug ? '__build' : dist),
       // filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
        // chunkFilename: debug ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
       // chunkFilename:  "[chunkhash].bundle.js",
       // hotUpdateChunkFilename: debug ?'[id].[chunkhash:8].js' : 'js/[id].[chunkhash:8].min.js',
        publicPath: debug ? '/__build/' : ''
  	},
	module: {
	    loaders: [
	      {
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'image?{bypassOnDebug: true, progressive:true, \
						optimizationLevel: 3, pngquant:{quality: "65-80"}}',
					'url?limit=10000&name=img/[hash:8].[name].[ext]',
				]
			},
			{
				test: /\.(woff|eot|ttf)$/i,
				loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
			},
			{test: /\.(tpl|ejs)$/, loader: 'ejs'},
			//{test: /\.js$/, loader: 'jsx'},
			{test: /\.css$/, loader: 'style!css'},
			{test: /\.scss$/, loader: 'style!css!scss'},
			{
		        test: /\.js$/,
		        loaders: ['babel?presets[]=es2015'],
		        exclude: /node_modules/
		    }
	    ]
	},
	resolve:{
		extensions:['','.js','.json'],
		root: [process.cwd() + '/src', process.cwd() + '/node_modules'],
	    alias: {},
	    extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg']
 	},

  	plugins: [
    	new webpack.BannerPlugin('This file is created by Aberli'),
    	new webpack.HotModuleReplacementPlugin()
  	]
}

// 读取src目录中的js文件列表
function genEntries() {
    var jsDir = path.resolve(srcDir, 'js');
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}