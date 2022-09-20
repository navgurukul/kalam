# git checkout gh-pages

# git reset --hard origin/main

npm run dev-build

cp 404.html dev-dist/

# cp -r dev-dist/* .

cd dev-dist

git init

git remote add origin https://github.com/navgurukul/dev-kalam.git

echo 'dev-admissions.navgurukul.org' > CNAME

git branch -M gh-pages

git add -A .

git commit -a -m 'gh-pages update' --no-verify

git push origin gh-pages --force

# git checkout main

cd ../

rm -rf dev-dist/
