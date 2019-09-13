<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserTest extends TestCase {

    use DatabaseTransactions;

    public function setUp() {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_show_all_the_users() {
        $inserteduser = factory(User::class)->create();
        $userRepo = new UserRepository(new User);
        $list = $userRepo->listUsers()->toArray();
        $myLastElement = end($list);
        // $this->assertInstanceOf(Collection::class, $list);
        $this->assertEquals($inserteduser->toArray(), $myLastElement);
    }

    /** @test */
    public function it_can_delete_the_user() {
        $user = factory(User::class)->create();
        $userRepo = new UserRepository($user);
        $deleted = $userRepo->deleteUser($user->id);
        $this->assertTrue($deleted);
    }

    /** @test */
    public function it_can_update_the_user() {
        $user = factory(User::class)->create();
        $data = ['first_name' => 'Unittest'];
        $userRepo = new UserRepository($user);
        $updated = $userRepo->updateUser($data);
        $found = $userRepo->findUserById($user->id);
        $this->assertTrue($updated);
        $this->assertEquals($data['first_name'], $found->first_name);
    }

    /** @test */
    public function it_can_show_the_user() {
        $user = factory(User::class)->create();
        $userRepo = new UserRepository(new User);
        $found = $userRepo->findUserById($user->id);
        $this->assertInstanceOf(User::class, $found);
        $this->assertEquals($user->name, $found->name);
    }

    /** @test */
    public function it_can_create_a_user() {
        $data = [
            'first_name' => 'Michael',
            'last_name' => 'Hampton',
            'email' => 'michaelhamptondesign@yahoo.com',
            'username' => 'unit.test',
            'password' => 'dfdfdddf',
            'is_active' => 1,
            'profile_photo' => 'test',
        ];

        $userRepo = new UserRepository(new User);
        $user = $userRepo->createUser($data);
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($data['first_name'], $user->first_name);
    }

    /**
     * @codeCoverageIgnore
     */
    public function it_errors_creating_the_user_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $product = new UserRepository(new User);
        $product->createUser([]);
    }

    /** @test */
    public function it_errors_finding_a_user() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $user = new UserRepository(new User);
        $user->findUserById(999);
    }

    public function tearDown() {
        parent::tearDown();
    }

}
