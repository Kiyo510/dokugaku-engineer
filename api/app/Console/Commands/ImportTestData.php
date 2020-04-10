<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\TakingCourse;

class ImportTestData extends Command
{
    // 一度にINSERTするユーザー数
    const ONCE_INSERT_NUM = 1000;
    // INSERTを行う回数
    const INSERT_LOOP_NUM = 10;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:test-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import test data of course, part, lesson, lecture, user and taking course';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // コース関連のデータのインポート
        $this->call('import:lecture-csv');
        // ユーザー関連のデータのインポート
        for ($i = 1; $i <= $this::INSERT_LOOP_NUM; $i++) {
            $users = $this->insertUsers();
            $this->insertTakingCourses($users);
        }
    }

    private function insertUsers()
    {
        $lastId = User::orderBy('id', 'desc')->first()->id;
        $users = [];
        for ($i = $lastId + 1; $i <= ($lastId + 1 + $this::ONCE_INSERT_NUM); $i++) {
            $user = [
                'id' => $i,
                'username' => (string) ($i * 100),
                'email' => "$i@example.com",
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString(),
            ];
            array_push($users, $user);
        }
        DB::table("users")->insert($users);
        return $users;
    }

    private function insertTakingCourses($users)
    {
        $lastId = TakingCourse::orderBy('id', 'desc')->first()->id;
        $takingCourses = [];
        foreach ($users as $index => $user) {
            $takingCourse = [
                'id' => $lastId + $index + 1,
                'user_id' => $user['id'],
                'course_id' => 1,
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString(),
            ];
            array_push($takingCourses, $takingCourse);
        }
        DB::table("taking_courses")->insert($takingCourses);
        return $takingCourses;
    }
}
