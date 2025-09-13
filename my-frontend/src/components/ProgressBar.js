"use client";

import React from "react";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TimerIcon,
} from "lucide-react";

const ProgressTracker = () => {
  // Hardcoded progress data
  const weeklyProgress = [
    { day: "Mon", hours: 4.5, target: 5 },
    { day: "Tue", hours: 3.2, target: 5 },
    { day: "Wed", hours: 5.8, target: 5 },
    { day: "Thu", hours: 4.1, target: 5 },
    { day: "Fri", hours: 6.2, target: 5 },
    { day: "Sat", hours: 7.5, target: 6 },
    { day: "Sun", hours: 5.9, target: 6 },
  ];

  const subjects = [
    {
      name: "Mathematics",
      progress: 78,
      totalHours: 45,
      weekHours: 12,
      color: "bg-blue-500",
    },
    {
      name: "Data Structures",
      progress: 65,
      totalHours: 32,
      weekHours: 8,
      color: "bg-green-500",
    },
    {
      name: "Physics",
      progress: 82,
      totalHours: 38,
      weekHours: 10,
      color: "bg-purple-500",
    },
    {
      name: "Computer Science",
      progress: 71,
      totalHours: 28,
      weekHours: 7,
      color: "bg-orange-500",
    },
  ];

  const achievements = [
    {
      title: "7-Day Streak",
      description: "Studied consistently for a week",
      icon: Award,
      earned: true,
    },
    {
      title: "Early Bird",
      description: "Completed morning study sessions",
      icon: Clock,
      earned: true,
    },
    {
      title: "Goal Crusher",
      description: "Exceeded weekly target by 20%",
      icon: Target,
      earned: false,
    },
    {
      title: "Knowledge Seeker",
      description: "Completed 50 study sessions",
      icon: BookOpen,
      earned: true,
    },
  ];

  const todayStats = {
    hoursStudied: 3.5,
    sessionsCompleted: 4,
    tasksCompleted: 7,
    targetHours: 5,
  };

  const overallStats = {
    totalHours: 156,
    completedTasks: 89,
    currentStreak: 12,
    weeklyGoal: 85, // percentage
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Progress Tracker
        </h2>
        <p className="text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Hours Today</p>
              <p className="text-2xl font-bold text-blue-800">
                {todayStats.hoursStudied}
              </p>
              <p className="text-xs text-blue-600">
                Target: {todayStats.targetHours}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    (todayStats.hoursStudied / todayStats.targetHours) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Sessions</p>
              <p className="text-2xl font-bold text-green-800">
                {todayStats.sessionsCompleted}
              </p>
              <p className="text-xs text-green-600">Completed today</p>
            </div>
            <TimerIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Tasks Done</p>
              <p className="text-2xl font-bold text-purple-800">
                {todayStats.tasksCompleted}
              </p>
              <p className="text-xs text-purple-600">Today's progress</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Streak</p>
              <p className="text-2xl font-bold text-orange-800">
                {overallStats.currentStreak}
              </p>
              <p className="text-xs text-orange-600">Days active</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Weekly Study Hours
        </h3>
        <div className="flex items-end justify-between h-40">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="relative w-8 bg-gray-200 rounded-t-lg mb-2"
                style={{ height: "120px" }}
              >
                <div
                  className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${
                      (day.hours /
                        Math.max(...weeklyProgress.map((d) => d.target))) *
                      100
                    }%`,
                  }}
                ></div>
                <div
                  className="absolute w-full border-t-2 border-red-300 border-dashed"
                  style={{
                    bottom: `${
                      (day.target /
                        Math.max(...weeklyProgress.map((d) => d.target))) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {day.day}
              </span>
              <span className="text-xs text-gray-500">{day.hours}h</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            Actual Hours
          </div>
          <div className="flex items-center">
            <div className="w-3 h-1 border-t-2 border-red-300 border-dashed mr-2"></div>
            Target
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Progress */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Subject Progress
          </h3>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">{subject.name}</h4>
                  <span className="text-sm font-semibold text-gray-600">
                    {subject.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${subject.color} transition-all duration-500`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Total: {subject.totalHours}h</span>
                  <span>This week: {subject.weekHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg border ${
                    achievement.earned
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      achievement.earned ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${
                        achievement.earned ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        achievement.earned ? "text-green-800" : "text-gray-600"
                      }`}
                    >
                      {achievement.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        achievement.earned ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Weekly Goal Progress
          </h3>
          <span className="text-2xl font-bold text-indigo-600">
            {overallStats.weeklyGoal}%
          </span>
        </div>
        <div className="w-full bg-white rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallStats.weeklyGoal}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Keep going! You're doing great.</span>
          <span>{100 - overallStats.weeklyGoal}% to go</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
