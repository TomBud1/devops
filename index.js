const express = require("express");
const redis = require("redis");
const process = require("process")
const app = express();
const client = redis.createClient({
	host: 'my-redis-server',
	port: 6379
});

client.set('counter', 0);
client.set('nwd', 0);




app.get('/', (req, resp) => {
	
	//process.exit(1);
	
	client.get('counter', (err, counter_value) => {
	resp.send('Counter: ' + counter_value);
	client.set('counter', parseInt(counter_value) + 1);
	});
});

app.get("/nwd", (req, res) => {
	const l1 = req.query.l1;
	const l2 = req.query.l2;

	if (!l1 || !l2) {
		res.send("Podaj obie liczby!");
		return;
	}

	const key = `${l1}_${l2}`;
	client.exists(key, (err, exists) => {
		if (exists === 1) {
			client.get(key, (err, nwd) => {
				res.send("NWD (cached): " + nwd);
				return;
			});
		} else {
			const nwd = countNWD(l1, l2);
			client.set(key, nwd);
			res.send("NWD: " + nwd);
		}
	});
});
 
countNWD = (a, b) => {
    while (a != b) {
        if (a < b) {
          pom = a; a = b; b = pom;
        } 
        a = a - b;
      }
      return a;
}

app.listen(8080, () => {
	console.log("Listening on port 8080");
});
