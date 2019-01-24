# RUN IT

 * install docker
 * bin/build
 * bin/server

# USE IT

```
curl -v -s -H "Content-Type: application/json" -X POST http://localhost:3100/screenshot -d '{ "url": "http://www.google.com" }' > image.png 
```

