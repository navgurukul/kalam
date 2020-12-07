git branch -f gh-pages

git checkout gh-pages

git reset --hard origin/main

npm run build

cp -r build/* .

echo 'admissions.navgurukul.org' > CNAME

git add -A .

git commit -a -m 'gh-pages update'

git push origin gh-pages --force

git checkout main
