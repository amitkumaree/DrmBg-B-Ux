# Inorder to pull jason file data added below 2 lines in tsconfig.json
    "resolveJsonModule": true,
    "esModuleInterop": true,
suggestion from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#new---resolvejsonmodule



# UX
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


dependency :
> import  html2pdf from 'html2pdf.js';
npm i webdatarocks --save

## important commands
1. ng g c bank-resolver\finance\report\dailybook --skipTests=true  to create diailybook inside Finance/report
2. ng build --base-href "/SynergicBanking/" --prod --build-optimizer  --aot --output-hashing=all
3. ng build --base-href "/dev.SynergicBanking/" --prod --build-optimizer  --aot --output-hashing=all

## While new deployment
1. change index.html's base url
2. change webconfig action type="Rewrite" url=

## install ngx export
npm i ngx-export-as
npm i ng2-date-picker [https://www.npmjs.com/package/ng2-date-picker]
npm install ngx-bootstrap --save [https://valor-software.com/ngx-bootstrap/#/documentation]
npm install ngx-bootstrap bootstrap --save

git pull https://github.com/amitkumaree/DrmBg-B-Ux.git master

## after cloning please run the below
npm install
npm prune ## removes all unused pacakages
Elq6bajVn
Synergic#AM@2906
1013605

## If we get error " cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170. " 
run the below command in power shell with admin mode
" Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine "

## Staging file not presnt error while npm install try below
npm cache clean -f
rm -rf node_modules
npm i

## Report Oracle.dataaccess problem to be resolved via checking entry in Webconfig
search oracle dataaccess assembly binding and match its version with dll version.

## Before deployment make sure to replace the below
find all 
../../../../../assets/         with assets/   
../../../assets/               with assets/
