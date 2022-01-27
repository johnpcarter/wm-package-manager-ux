#!/bin/sh

if [ "$1x" == "debugx" ]
then
	ng build --base-href /WxPackageManager/
else
	ng build  --configuration production --base-href /WxPackageManager/
fi

# remove old version from package

TGT_PATH=/Applications/SoftwareAG/10.11/IntegrationServer/instances/default/packages/WxPackageManager/pub
rm -Rf ${TGT_PATH}/*.*.js
rm -Rf ${TGT_PATH}/*.*.css
rm -Rf ${TGT_PATH}/font-*

# copy new build to package

cp -R dist/wm-package-manager/* ${TGT_PATH}

# changes paths to include package name-space

if [ -r ${TGT_PATH}/main.js ]
then
	main="${TGT_PATH}/main.js"
else
	main=`ls ${TGT_PATH}/main.*.js`
fi

#sed "s/favicon/\/WxPackageManager\/favicon/g" ${TGT_PATH}/index.html > ${TGT_PATH}/index.html.copy
#mv ${TGT_PATH}/index.html.copy ${TGT_PATH}/index.html

#sed "s/src\=\"/src\=\"\/WxPackageManager\//g" ${TGT_PATH}/index.html > ${TGT_PATH}/index.html.copy
#mv ${TGT_PATH}/index.html.copy ${TGT_PATH}/index.html

#sed "s/styles\./\/WxPackageManager\/styles\./g" ${TGT_PATH}/index.html > ${TGT_PATH}/index.html.copy
#mv ${TGT_PATH}/index.html.copy ${TGT_PATH}/index.html

#sed "s/\assets/\/WxPackageManager\/assets/g" ${main} > ${main}.copy
#cp ${main}.copy ${main}

#sed "s/\.\/images/\/WxPackageManager\/images/g" ${main} > ${main}.copy
#mv ${main}.copy ${main}

cd ${TGT_PATH}
/Users/jcart/Scripts/shell/cpFileToDirs.sh .access

echo "-------> built ${BLD_NEW}"
