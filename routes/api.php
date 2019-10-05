<?php

use Illuminate\Http\Request;

// routes/api.php

Route::get('status/{task_type}', 'TaskStatusController@index');
Route::get('dashboard', 'DashboardController@index');
Route::get('activity', 'ActivityController@index');

// messages
Route::get('messages/customers', 'MessageController@getCustomers');
Route::get('messages/{customer_id}', 'MessageController@index');
Route::post('messages', 'MessageController@store');

// invoice
Route::post('invoice', 'InvoiceController@store');
Route::get('invoice', 'InvoiceController@index');
Route::get('invoice/task/{task_id}', 'InvoiceLineController@getInvoiceLinesForTask');
Route::get('invoice/{invoice_id}', 'InvoiceController@show');
Route::delete('invoice/line/{line_id}', 'InvoiceLineController@destroyLine');
Route::put('invoice/line/{line_id}', 'InvoiceLineController@updateLine');
Route::put('invoice/{invoice_id}', 'InvoiceController@update');

// customers
Route::get('customers/dashboard', 'CustomerController@dashboard');
Route::get('customers', 'CustomerController@index');
Route::get('customers/{customer_id}', 'CustomerController@show');
Route::put('customers/{customer_id}', 'CustomerController@update');
Route::post('customers', 'CustomerController@store');
Route::delete('customers/{customer_id}', 'CustomerController@destroy');

// tasks
Route::put('tasks/{task_id}', 'TaskController@update');
Route::post('tasks', 'TaskController@store');
Route::get('tasks/getTasksForProject/{project_id}', 'TaskController@getTasksForProject');
Route::put('tasks/complete/{task}', 'TaskController@markAsCompleted');
Route::delete('tasks/{task}', 'TaskController@destroy');
Route::post('tasks/filterTasks/{task_type}', 'TaskController@filterTasks');
Route::put('tasks/status/{task_id}', 'TaskController@updateStatus');
Route::get('leads', 'TaskController@getLeads');
Route::get('deals', 'TaskController@getDeals');
Route::post('tasks/deal', 'TaskController@createDeal');
Route::get('tasks', 'TaskController@index');
Route::get('tasks/subtasks/{task_id}', 'TaskController@getSubtasks');
Route::post('tasks/products/{task_id}', 'TaskController@addProducts');
Route::get('tasks/products/{task_id}', 'TaskController@getProducts');
Route::get('tasks/products', 'TaskController@getTasksWithProducts');
Route::get('tasks/source-types', 'TaskController@getSourceTypes');
Route::post('tasks/form', 'TaskController@handleForm');

// roles
Route::get('roles', 'RoleController@index');
Route::post('roles', 'RoleController@store');
Route::delete('roles/{role_id}', 'RoleController@destroy');
Route::get('roles/{role_id}', 'RoleController@edit');
Route::put('roles/{role_id}', 'RoleController@update');

//departments
Route::get('departments', 'DepartmentController@index');
Route::post('departments', 'DepartmentController@store');
Route::delete('departments/{department_id}', 'DepartmentController@destroy');
Route::get('departments/{department_id}', 'DepartmentController@edit');
Route::put('departments/{department_id}', 'DepartmentController@update');

//brands
Route::get('brands', 'BrandController@index');
Route::post('brands', 'BrandController@store');
Route::delete('brands/{brand_id}', 'BrandController@destroy');
Route::get('brands/{brand_id}', 'BrandController@edit');
Route::put('brands/{brand_id}', 'BrandController@update');

//categories
Route::get('categories', 'CategoryController@index');
Route::post('categories', 'CategoryController@store');
Route::delete('categories/{category_id}', 'CategoryController@destroy');
Route::get('categories/{category_id}', 'CategoryController@edit');
Route::put('categories/{category_id}', 'CategoryController@update');
Route::get("category/{slug}", 'CategoryController@getCategory');
Route::get("category-list", 'CategoryController@getRootCategories');
Route::get("categories/children/{slug}", 'CategoryController@getChildCategories');

// comments
Route::get('comments/{task_id}', 'CommentController@index');
Route::delete('comments/{comment_id}', 'CommentController@destroy');
Route::put('comments/{comment_id}', 'CommentController@update');
Route::post('comments', 'CommentController@store');

// users
Route::delete('users/{user_id}', 'UserController@destroy');
Route::post('users', 'UserController@store');
Route::get('users/dashboard', 'UserController@dashboard');
Route::get('users/edit/{user_id}', 'UserController@edit');
Route::put('users/{user_id}', 'UserController@update');
Route::get('users', 'UserController@index');
Route::post('user/upload', 'UserController@upload');
Route::get('user/profile/{username}', 'UserController@profile');
Route::get('users/department/{department_id}', 'UserController@filterUsersByDepartment');

// events
Route::get('events', 'EventController@index');
Route::delete('events/{event_id}', 'EventController@destroy');
Route::put('events/{event_id}', 'EventController@update');
Route::get('events/{event_id}', 'EventController@show');
Route::post('events', 'EventController@store');
Route::get('events/tasks/{task_id}', 'EventController@getEventsForTask');
Route::get('events/users/{user_id}', 'EventController@getEventsForUser');

// products
Route::get('products', 'ProductController@index');
Route::post('products', 'ProductController@store');
Route::delete('products/{product_id}', 'ProductController@destroy');
Route::put('products/{product_id}', 'ProductController@update');
Route::get('products/tasks/{task_id}', 'ProductController@getProductsForTask');
Route::get('products/filter/{filter_type}/{id}', 'ProductController@filterProducts');
Route::get('product/{slug}', 'ProductController@getProduct');

// projects
Route::get('projects', 'ProjectController@index');
Route::get('projects', 'ProjectController@index');
Route::post('projects', 'ProjectController@store');
Route::get('projects/{id}', 'ProjectController@show');
Route::put('projects/{project}', 'ProjectController@update');

// login
Route::get('login', 'LoginController@showLogin');
Route::post('login', 'LoginController@doLogin');
Route::get('logout', 'LoginController@doLogout');

// uploads
Route::post('uploads', 'UploadController@store');
Route::get('uploads/{task_id}', 'UploadController@index');
Route::delete('uploads/{file_id}', 'UploadController@destroy');
