const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const SSLCommerzPayment = require("sslcommerz-lts");
// const cookieParser=require('cookie-parser')
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

// ==========middleware===========
app.use(
  cors({
    origin: ["http://localhost:5173"], 
    credentials: true,
  })
);
app.use(express.json());
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yzoz4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjhcvof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// ssl commerz cresentials
const store_id = process.env.storeID;
const store_passwd = process.env.storePasswd;
const is_live = false; //true for live, false for sandbox 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version===
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(){
  try {
    const products = client.db("PawCare").collection("products");
    const cart = client.db("PawCare").collection("cart");
    const users = client.db("PawCare").collection("users");
    const medicine = client.db("PawCare").collection("medicine");
    const adopt = client.db("PawCare").collection("adopt");
    const doctors = client.db("PawCare").collection("doctors");
    const apointments = client.db("PawCare").collection("apointments");
    const applications = client.db("PawCare").collection("applications");
     // =================== adopt crud operations ========================
     app.post("/adopt", async (req, res) => {
      const pet = req.body;
      const result = await adopt.insertOne(pet);
      res.send(result);
    });
    app.get("/adopt", async (req, res) => {
      const result = await adopt.find().toArray();
      res.send(result);
    });
    app.get("/adopt/:id", async (req, res) => {
      const id = req.params.id;
      const query = { email: id };
      const result = await adopt.find().toArray();
      res.send(result);
    });
     // =================== doctors crud operations ========================
     app.post("/doctors", async (req, res) => {
      const doc = req.body;
      const result = await doctors.insertOne(doc);
      res.send(result);
    });
    app.get("/doctors", async (req, res) => {
      const result = await doctors.find().toArray();
      res.send(result);
    });
    app.get("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await doctors.findOne(query);
      res.send(result);
    });
     // =================== applications crud operations ========================
     app.post("/applications", async (req, res) => {
      const doc = req.body;
      const result = await applications.insertOne(doc);
      res.send(result);
    });
    app.get("/applications", async (req, res) => {
      const result = await applications.find().toArray();
      res.send(result);
    });
    app.get("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { email: id };
      const result = await applications.find().toArray();
      res.send(result);
    });
     // =================== apointments crud operations ========================
     app.post("/apointments", async (req, res) => {
      const apointment = req.body;
      const result = await apointments.insertOne(apointment);
      res.send(result);
    });
    app.get("/apointments", async (req, res) => {
      const result = await apointments.find().toArray();
      res.send(result);
    });
    app.get("/apointments/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { email: id };
      const result = await apointments.find(query).toArray();
      res.send(result);
    });
    // =================== products crud operations ======================
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await products.insertOne(product);
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      console.log("all products hit")
      const result = await products.find().toArray();
      console.log(result)
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });
    app.get("/products/:categories", async (req, res) => {
      const categories = req.params.categories;
      const query = { category: categories };
      const result = await products.find(query).toArray();
      res.send(result);
    });
    app.get("/products/:email", async (req, res) => {
   
      const email = req.params.email;
      const query = { email: email };
      const result = await products.find(query).toArray();
      res.send(result);
    });
    // get all medicine added by individual user
    app.get("/medicine/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "author.author_email": email };
      const result = await medicine.find(query).toArray();
      console.log(result)
      res.send(result);
    });
    // post a course
    app.post("/medicine", async (req, res) => {
      const medicine = req.body;
      const result = await medicine.insertOne(medicine);
      console.log(result)
      res.send(result);
    });

    // get a specific course=
    app.get("/users/medicine/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await medicine.findOne(query);
      res.send(result);
    });

    // Get all medicine
    app.get("/medicine", async (req, res) => {
      const result = await medicine.find().toArray();
      res.send(result);
    });

    // cart post operation
    app.post("/cart", async (req, res) => {
      const item = req.body;
      const { _id, ...rest } = item;
      const query = { _id: new ObjectId(_id) };
      const isExist = await cart.findOne(query);
      if (isExist) {
        return res.send({ message: "already exists" });
      }

      const result = await cart.insertOne(rest);
      res.send(result);
    });

    // get cart items based on user email
    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cart.find(query).toArray();
      
      res.send(result);
      
    });
    // delete items from cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)  };
      const result = await cart.deleteOne(query);
      console.log(result)
      res.send(result);
    });

    // delete a course
    app.delete("/admin/medicine/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await medicine.deleteOne(query);
      res.send(result);
    });
    // delete a products
    app.delete("/admin/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.deleteOne(query);
      res.send(result);
    });
    // post user info
    app.post("/users", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await users.findOne(query);
      if(result.insertedId){
        return res.send({message:"already exists"})
      }else{
        const user = req.body;
        const result = await users.insertOne(user);
        res.send(result);
      }
    });

    // get user info
    app.get("/admin/users", async (req, res) => {
   
      const result = await users.find().toArray();
      res.send(result);
    });
    // get user info
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await users.findOne(query);
      res.send(result);
    });

    // for payment
    app.post("/payment", async (req, res) => {
      const tran_id = new ObjectId().toString();
      const id = new ObjectId().toString();

      const cartItem = req.body;
      const email = cartItem.userEmail;
      const medicine = cartItem.medicine; // No need to spread here, assuming medicine is an array=

      // New properties to add to each course
      const newProperties = {
        purchase: false,
        payment: false,
      };

      // Destructure the original array and add new properties to each object
      const modifiedArray = medicine?.map((obj) => {
        // Destructure the object and add new properties
        return {
          ...obj, // Spread the original properties
          ...newProperties, // Add new properties
        };
      });

      // Assuming id is defined somewhere else
      const result = await users.updateOne(
        { email: email },
        {
          $addToSet: { // Use $addToSet to add unique elements to an array
            purchaseList: { $each: modifiedArray }
          }
        }
      );

      const data = {
        total_amount: cartItem?.total_bill,
        currency: "BDT",
        tran_id: tran_id,
        success_url: `http://localhost:5000/user/payment/success/${tran_id}?email=${email}`,
        fail_url: `http://localhost:5000/user/payment/fail/${tran_id}?email=${email}`,
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Course",
        product_category: "Mix category",
        product_profile: "general",
        cus_name: "cartItem?.userName",
        cus_email: "cartItem?.userEmail",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send({ url: GatewayPageURL });
        console.log("Redirecting to: ", GatewayPageURL);
      });

      app.post("/user/payment/success/:tranId", async (req, res) => {
        const result = await users.updateOne(
          {
            email: req.query.email,
            purchaseList: {
              $elemMatch: {
                purchase: false,
                payment: false,
              },
            },
          },
          {
            $set: {
              "purchaseList.$.purchase": true,
              "purchaseList.$.payment": true,
              transactionId: req.params.tranId,
            },
          }
        );
        if (result.modifiedCount > 0) {
          res.redirect(
            `http://localhost:5173/payment-complete/${req.params.tranId}`
          );
        }

        const cartIds = await cart.find().toArray();
        const ids = cartIds.map((x) => x._id);
        const query = { _id: { $in: ids } };
        await cart.deleteMany(query);
      });
      app.post("/user/payment/fail/:tranId", async (req, res) => {
   
       
          res.redirect(
            `http://localhost:5173/payment-failed/${req.params.tranId}`
          );
        
      });
    });

    // checking whether a user admin or not 
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
        role: "admin",
      };
      const result = await users.findOne(query);
      if (result) {
        res.send({ admin: true });
      } else {
        res.send({ admin: false });
      }
   
    });
// delete a user
    app.delete("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await users.deleteOne(query);
      res.send(result);
    });

    // make a user admin
    app.patch("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await users.updateOne(filter, updatedDoc);
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.listen(port, () => {
  console.log(`backend is running on port ${port}`);
});