# frozen_string_literal: true

class InsertStatementsVideoMarksData < ActiveRecord::Migration[6.0]
  TIMINGS = {
    18_598 => %w[0:46 1:03],
    18_599 => %w[1:06 1:12],
    18_601 => %w[2:33 3:01],
    18_602 => %w[3:19 3:32],
    18_603 => %w[4:12 4:25],
    18_604 => %w[4:43 5:15],
    18_605 => %w[5:19 5:47],
    18_606 => %w[6:57 7:08],
    18_607 => %w[7:09 7:41],
    18_608 => %w[7:44 8:03],
    18_609 => %w[8:03 8:15],
    18_610 => %w[9:15 9:21],
    18_611 => %w[9:24 9:40],
    18_612 => %w[9:41 9:43],
    18_614 => %w[9:53 9:56],
    18_615 => %w[10:17 10:24],
    18_616 => %w[10:34 11:05],
    18_617 => %w[11:23 11:25],
    18_618 => %w[12:42 12:50],
    18_620 => %w[14:02 14:13],
    18_619 => %w[14:33 14:39],
    18_621 => %w[15:42 16:00],
    18_622 => %w[18:12 18:16],
    18_623 => %w[18:31 18:48],
    18_624 => %w[18:52 18:55],
    18_625 => %w[19:50 20:15],
    18_626 => %w[21:25 21:31]
  }

  def up
    convert = lambda do |time|
      minutes, seconds = time.split(":")
      minutes.to_i * 60 + seconds.to_i
    end

    Statement.transaction do
      TIMINGS.each_key do |id|
        statement = Statement.find(id)

        start, stop = TIMINGS[id]

        statement.build_statement_video_mark(
          statement_id: id,
          source_id: statement.source.id,
          start: convert.call(start),
          stop: convert.call(stop)
        )

        statement.statement_video_mark.save!
      end
    end
  end

  def down
    Statement.transaction do
      TIMINGS.each_key { |id| StatementVideoMark.delete_by(statement_id: id) }
    end
  end
end
