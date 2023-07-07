# Problem Solving

## app.post(..., ()=> req.body) req.body = undefined
### solving
- add middleware:
```
app.use(express.json())
app.use(express.urlencoded({ extended: true  }))
```
sumber: https://expressjs.com/en/4x/api.html#req.body

### Commit
Jadi pas mau commit tiba2 HEAD ga di branch manapun akhirnya harus ke branch main dulu
Trus lakukan rebase disitu biar main nya ke commit si HEAD yang tadi
```
git checkout main
git rebase <nomor_commit>
```




