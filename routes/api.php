<?php

use Illuminate\Http\Request;

 // routes/api.php

Route::get('projects', 'ProjectController@index');
Route::get('projects', 'ProjectController@index');
Route::post('projects', 'ProjectController@store');
Route::get('users/dashboard', 'UserController@dashboard');
Route::get('users/edit/{user_id}', 'UserController@edit');
Route::get('customers/dashboard', 'CustomerController@dashboard');
Route::get('projects/{id}', 'ProjectController@show');
Route::put('projects/{project}', 'ProjectController@markAsCompleted');
Route::post('tasks', 'TaskController@store');
Route::get('tasks/getTasksForProject/{project_id}', 'TaskController@getTasksForProject');
//Route::put('tasks/{task}', 'TaskController@markAsCompleted');
Route::delete('tasks/{task}', 'TaskController@destroy');
Route::post('tasks/filterTasks/{task_type}', 'TaskController@filterTasks');
Route::delete('users/{user_id}', 'UserController@destroy');
Route::post('users', 'UserController@store');
Route::get('status/{task_type}', 'TaskStatusController@index');
Route::put('users/{user_id}', 'UserController@update');
Route::get('users', 'UserController@index');
Route::post('uploads', 'UploadController@store');
Route::post('comments', 'CommentController@store');
Route::get('uploads/{task_id}', 'UploadController@index');
Route::get('comments/{task_id}', 'CommentController@index');
Route::put('tasks/{task_id}', 'TaskController@update');
Route::get('leads', 'TaskController@getLeads');
Route::put('tasks/status/{task_id}', 'TaskController@updateStatus');
Route::get('roles', 'RoleController@index');
Route::post('roles', 'RoleController@store');
Route::delete('roles/{role_id}', 'RoleController@destroy');
Route::get('roles/{role_id}', 'RoleController@edit');
Route::put('roles/{role_id}', 'RoleController@update');
Route::post('invoice', 'InvoiceController@store');
Route::get('invoice', 'InvoiceController@index');
Route::get('invoice/{invoice_id}', 'InvoiceController@show');
Route::delete('invoice/line/{line_id}', 'InvoiceController@destroyLine');
Route::put('invoice/line/{line_id}', 'InvoiceController@updateLine');
Route::put('invoice/{invoice_id}', 'InvoiceController@update');
Route::get('customers', 'CustomerController@index');
Route::get('customers/{customer_id}', 'CustomerController@show');
Route::put('customers/{customer_id}', 'CustomerController@update');
Route::post('customers', 'CustomerController@store');
Route::delete('customers/{customer_id}', 'CustomerController@destroy');
Route::get('events', 'EventController@index');
Route::delete('events/{event_id}', 'EventController@destroy');
Route::put('events/{event_id}', 'EventController@update');
Route::get('events/{event_id}', 'EventController@show');
Route::post('events', 'EventController@store');
Route::get('login', 'LoginController@showLogin');
Route::post('login', 'LoginController@doLogin');
Route::get('logout', 'LoginController@doLogout');
Route::get('messages/customers', 'MessageController@getCustomers');
Route::get('messages/{customer_id}', 'MessageController@index');
Route::post('messages', 'MessageController@store');

Route::get('products', 'ProductController@index');
Route::post('products', 'ProductController@store');
Route::delete('products/{product_id}', 'ProductController@destroy');
Route::put('products/{product_id}', 'ProductController@update');

