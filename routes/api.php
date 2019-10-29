<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


// routes/api.php

Route::group(['middleware' => ['jwt.auth', 'api-header']], function () {

    Route::group(['middleware' => ['role:Admin']], function () {
        Route::get('status/{task_type}', 'TaskStatusController@index');
        Route::get('dashboard', 'DashboardController@index');
        Route::get('activity', 'ActivityController@index');

        // messages
        Route::get('messages/customers', 'MessageController@getCustomers');
        Route::get('messages/{customer_id}', 'MessageController@index');
        Route::post('messages', 'MessageController@store');

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

// comments
        Route::get('comments/{task_id}', 'CommentController@index');
        Route::delete('comments/{comment_id}', 'CommentController@destroy');
        Route::put('comments/{comment_id}', 'CommentController@update');
        Route::post('comments', 'CommentController@store');

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


// uploads
        Route::post('uploads', 'UploadController@store');
        Route::get('uploads/{task_id}', 'UploadController@index');
        Route::delete('uploads/{file_id}', 'UploadController@destroy');

// task status
        Route::get('taskStatus/search', 'TaskStatusController@search');
        Route::get('taskStatus', 'TaskStatusController@index');
        Route::post('taskStatus', 'TaskStatusController@store');
        Route::put('taskStatus/{project}', 'TaskStatusController@update');
        Route::delete('taskStatus/{status_id}', 'TaskStatusController@destroy');
    });

    // invoice
    Route::post('invoice', 'InvoiceController@store')->middleware('role:null,invoicecontroller.store');
    Route::get('invoice', 'InvoiceController@index')->middleware('role:null,invoicecontroller.index');
    Route::get('invoice/task/{task_id}', 'InvoiceLineController@getInvoiceLinesForTask')->middleware('role:null,invoicelinecontroller.getinvoicelinesfortask');
    Route::get('invoice/{invoice_id}', 'InvoiceController@show')->middleware('role:null,invoicecontroller.show');
    Route::delete('invoice/line/{line_id}', 'InvoiceLineController@destroyLine')->middleware('role:null,invoicelinecontroller.destroyline');
    Route::put('invoice/line/{line_id}', 'InvoiceLineController@updateLine')->middleware('role:null,invoicelinecontroller.updateline');
    Route::put('invoice/{invoice_id}', 'InvoiceController@update')->middleware('role:null,invoicecontroller.update');


// customers
    Route::get('customers/dashboard', 'CustomerController@dashboard')->middleware('role:null,customercontroller.dashboard');
    Route::get('customers', 'CustomerController@index')->middleware('role:null,customercontroller.index');
    Route::get('customers/{customer_id}', 'CustomerController@show')->middleware('role:null,customercontroller.show');
    Route::put('customers/{customer_id}', 'CustomerController@update')->middleware('role:null,customercontroller.update');
    Route::post('customers', 'CustomerController@store')->middleware('role:null,customercontroller.store');
    Route::delete('customers/{customer_id}', 'CustomerController@destroy')->middleware('role:null,customercontroller.destroy');
    Route::get('customers/customer-types', 'CustomerController@getCustomerTypes')->middleware('role:null,customercontroller.show');

// tasks
    Route::put('tasks/{task_id}', 'TaskController@update')->middleware('role:null,taskcontroller.update');
    Route::post('tasks', 'TaskController@store')->middleware('role:null,taskcontroller.store');
    Route::get('tasks/getTasksForProject/{project_id}', 'TaskController@getTasksForProject')->middleware('role:null,taskcontroller.gettasksforproject');
    Route::put('tasks/complete/{task}', 'TaskController@markAsCompleted')->middleware('role:null,taskcontroller.markascompleted');
    Route::delete('tasks/{task}', 'TaskController@destroy')->middleware('role:null,taskcontroller.destroy');
    Route::post('tasks/filterTasks/{task_type}', 'TaskController@filterTasks')->middleware('role:null,taskcontroller.filtertasks');
    Route::put('tasks/status/{task_id}', 'TaskController@updateStatus')->middleware('role:null,taskcontroller.updatestatus');
    Route::get('leads', 'TaskController@getLeads')->middleware('role:null,taskcontroller.getleads');
    Route::get('deals', 'TaskController@getDeals')->middleware('role:null,taskcontroller.getdeals');
    Route::get('tasks', 'TaskController@index')->middleware('role:null,taskcontroller.index');
    Route::get('tasks/subtasks/{task_id}', 'TaskController@getSubtasks')->middleware('role:null,taskcontroller.getsubtasks');
    Route::get('tasks/products/{task_id}', 'TaskController@getProducts')->middleware('role:null,taskcontroller.getproducts');
    Route::get('tasks/products', 'TaskController@getTasksWithProducts')->middleware('role:null,view-invoice');
    Route::get('tasks/source-types', 'TaskController@getSourceTypes')->middleware('role:null,view-invoice');
    Route::get('tasks/task-types', 'TaskController@getTaskTypes')->middleware('role:null,view-invoice');

    Route::group(['middleware' => ['role:Manager']], function () {

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

        // permissions
        Route::get('permissions', 'PermissionController@index');
        Route::post('permissions', 'PermissionController@store');
        Route::delete('permissions/{permission_id}', 'PermissionController@destroy');
        Route::get('permissions/{permission_id}', 'PermissionController@edit');
        Route::put('permissions/{permission_id}', 'PermissionController@update');

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
    });
});

Route::group(['middleware' => 'api-header'], function () {

    // login
    Route::get('login', 'LoginController@showLogin');
    Route::post('login', 'LoginController@doLogin');
    Route::get('logout', 'LoginController@doLogout');


    // unprotected routes for website
    Route::get("category-list", 'CategoryController@getRootCategories');
    Route::get("categories/children/{slug}", 'CategoryController@getChildCategories');
    Route::get("category/form/{id}", 'CategoryController@getForm');
    Route::get("category/{slug}", 'CategoryController@getCategory');
    Route::post('tasks/products/{task_id}', 'TaskController@addProducts');
    Route::post("categories/products/{id}", 'ProductController@getProductsForCategory');
    Route::post('tasks/deal', 'TaskController@createDeal');
});
