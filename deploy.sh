git branch -f gh-page

git checkout gh-page

git reset --hard origin/main

npm run build

cp -r dist/* .

echo 'admissions.navgurukul.org' > CNAME

git add -A .

git commit -a -m 'gh-page update'

git push origin gh-page --force

git checkout main

rm -rf dist/
