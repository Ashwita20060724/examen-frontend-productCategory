# DeliverUS Exam - October 2025

Remember that DeliverUS is described at: <https://github.com/IISSI2-IS-2025>

## Exam Statement

You must implement the graphical interface for some of the functional requirements of the owners, specifically:

### FR.01 – Display of Product Categories

**As an**  
owner,

**I want**  
to see a list with all the product categories associated with the restaurant I am viewing,

**So that**  
I can manage the categories I associate with that restaurant’s products.

### Exercise 1.a (1,5 points)

Work on FR.01 in the file `./src/screens/restaurants/RestaurantDetailScreen.js` making all the necessary changes to display an interface as shown in Figure 1.

![Button to display product categories](./DeliverUS-Frontend-Owner/mostrarCategorias.png)

Figure 1: Button to display categories

### Exercise 1.b (2,5 points)

Modify the file `./src/screens/restaurants/ProductCategoriesScreen` making all the necessary changes to display an interface as shown in Figure 2 (note that the delete button will be implemented in Exercise 3, so it is not necessary for now).

![Interface listing product categories](./DeliverUS-Frontend-Owner/mostrarCategorias2.png)

Figure 2: List of categories.

---

### FR.02 – Creation of New Product Categories

**As an**  
owner,

**I want**  
to create new product categories for each of my restaurants,

**So that**  
I can associate them with the restaurant’s products.

### Exercise 2.a (2 points)

Work on FR.02 in the file `./src/screens/restaurants/CreateProductCategoryScreen.js` making all the necessary changes to display an interface as shown in Figure 3.

![Creation of new categories](./DeliverUS-Frontend-Owner/CreacionCategoria.png)

Figure 3: Creation of new product categories.

### Exercise 2.b (1,5 points)

You must edit the file `./src/screens/EditProductScreen.js` so that categories can be assigned to products. To do this, modify the view so that the DropDownPicker for categories displays only those corresponding to the restaurant to which the product belongs.

---

### FR.03 – Deletion of Product Categories

**As an**  
owner,

**I want**  
to delete existing product categories, as long as they are not associated with any products,

**So that**  
I can remove those categories that are not useful to me.

### Acceptance Tests

- When a category is successfully deleted, it must be reflected in the list of categories, and a success message must be shown.
- If the category cannot be deleted, an error message must be displayed.

### Exercise 3. (2,5 points)

Work on FR.03 in the file `./src/screens/restaurants/ProductCategoriesScreen` making all the necessary changes to delete the category using a _Modal_ component.

## Submission Procedure

1. Delete the folders **DeliverUS-Backend/node_modules**, **DeliverUS-Frontend-Owner/node_modules**, and **DeliverUS-Frontend-Owner/.expo**.
2. Create a ZIP file that includes the entire project. **Important: Make sure the ZIP is not the same one you downloaded and that it includes your solution.**
3. Notify the instructor before submitting.
4. Once the instructor gives you the go-ahead, you can upload the ZIP to the Virtual Learning Platform. **It is very important to wait until the platform shows you a link to the ZIP before clicking the submit button.**  
   It is recommended to download that ZIP to verify what was uploaded. Once verified, you can submit the exam.

## Environment Setup

### a) Windows

- Open a terminal and run the following command:

  ```bash
  npm run install:all:win
  ```

### b) Linux/MacOS

- Open a terminal and run the following command:

  ```bash
  npm run install:all:bash
  ```

## Execution

### Backend

- To **recreate migrations and seeders**, open a terminal and run the following command:

  ```bash
  npm run migrate:backend
  ```

- To **start the backend**, open a terminal and run the following command:

  ```bash
  npm run start:backend
  ```

### Frontend

- To **run the owner frontend application**, open a new terminal and run the following command:

  ```bash
  npm run start:frontend
  ```

## Debugging

- To **debug the frontend**, ensure that an instance of the frontend you wish to debug is running, and use the browser's debugging tools.
