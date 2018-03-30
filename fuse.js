const {
  FuseBox,
  CSSPlugin,
  QuantumPlugin,
  Sparky
} = require('fuse-box')
const tar = require('tar')

const isProduction = process.argv.indexOf("--production") > -1

const fuse = FuseBox.init({
  homeDir: 'src',
  output: './public/$name.js',
  plugins: [CSSPlugin(),
  isProduction && QuantumPlugin({
    bakeApiIntoBundle: 'bundle',
    treeshake: true,
    uglify: true,
  }),
  ],
})

Sparky.task('config', () => { fuse.bundle("bundle").instructions(`>scripts/index.ts`) })
Sparky.task('clean', () => { Sparky.src('./').clean('public/') })
Sparky.task('build', ['clean', 'config'], () => fuse.run())
Sparky.task('release', ['build'], () => {

  // dockerfile作成
  var name = require("./package.json").name;
  require('fs').writeFileSync('./dist/Dockerfile', `FROM node:8-alpine\r\n\r\nADD ./ /root/${name}`
    + `\r\nWORKDIR /root/${name}\r\nRUN npm install\r\nENTRYPOINT ["node", "bin/www"]`)

  //docker用tar.gzファイル作成
  tar.c(
    {
      gzip: true, file: `./dist/${name}.tar.gz`
    },
    ['app.js','crowler.js', 'setting.js', 'package.json', 'package-lock.json', './bin/', './routes/', './public/', './views/']
  ).then(_ => { })
})
