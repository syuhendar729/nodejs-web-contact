# Problem Solving

## app.post(..., ()=> req.body) req.body = undefined
### solving
- add middleware:
```
app.use(express.json())
app.use(express.urlencoded({ extended: true  }))
```
sumber: https://expressjs.com/en/4x/api.html#req.body





